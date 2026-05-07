// API do SenaiBank separada do frontend (Express).
const express = require("express");
const cors = require("cors");

const { readDb, writeDb } = require("./lib/storage");
const { buildNewUser, comparePassword, signToken, verifyToken } = require("./lib/auth");
const { newId, nowIso, deposit, withdraw, transfer, getAccountBalance, getAccountStatement } = require("./lib/bank");
const { onlyDigits, assertValidName, isValidCpf, isValidEmail } = require("./lib/validation");

const app = express();
app.use(cors());
app.use(express.json());

function ok(res, data) {
  return res.status(200).json(data);
}
function created(res, data) {
  return res.status(201).json(data);
}
function fail(res, status, message) {
  return res.status(status).json({ error: message });
}

function requireAuth(req) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) throw new Error("Token não informado.");
  return verifyToken(match[1]);
}

// Cadastro
app.post("/auth/register", async (req, res) => {
  try {
    const db = await readDb();
    const user = await buildNewUser(req.body);

    if (db.users.some((u) => u.email === user.email)) return fail(res, 409, "E-mail já cadastrado.");
    if (db.users.some((u) => u.cpf === user.cpf)) return fail(res, 409, "CPF já cadastrado.");

    db.users.push(user);
    await writeDb(db);
    return created(res, { id: user.id, name: user.name, email: user.email, cpf: user.cpf });
  } catch (e) {
    return fail(res, 400, e?.message || "Erro ao cadastrar.");
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  try {
    const db = await readDb();
    const emailOrCpf = String(req.body.emailOrCpf || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const cpfDigits = onlyDigits(emailOrCpf);

    const user =
      db.users.find((u) => u.email === emailOrCpf) ||
      (cpfDigits ? db.users.find((u) => u.cpf === cpfDigits) : undefined);

    if (!user) return fail(res, 404, "Usuário não encontrado.");

    const okPass = await comparePassword(password, user.passwordHash);
    if (!okPass) return fail(res, 401, "Senha inválida.");

    return ok(res, { token: signToken({ sub: user.id, email: user.email }) });
  } catch (e) {
    return fail(res, 400, e?.message || "Erro ao autenticar.");
  }
});

// Contas
app.get("/accounts", async (req, res) => {
  try {
    const auth = requireAuth(req);
    const db = await readDb();
    const accounts = db.accounts.filter((a) => a.userId === auth.sub && !a.closedAt);
    return ok(res, { accounts });
  } catch (e) {
    return fail(res, 401, e?.message || "Erro ao listar contas.");
  }
});

app.post("/accounts", async (req, res) => {
  try {
    const auth = requireAuth(req);
    const db = await readDb();
    const user = db.users.find((u) => u.id === auth.sub);
    if (!user) return fail(res, 404, "Usuário não encontrado.");

    const account = { id: newId(), userId: user.id, createdAt: nowIso() };
    db.accounts.push(account);
    await writeDb(db);
    return created(res, { account });
  } catch (e) {
    return fail(res, 401, e?.message || "Erro ao criar conta.");
  }
});

app.patch("/accounts/:id", async (req, res) => {
  try {
    const auth = requireAuth(req);
    const db = await readDb();
    const account = db.accounts.find((a) => a.id === req.params.id && !a.closedAt);
    if (!account) return fail(res, 404, "Conta não encontrada.");
    if (account.userId !== auth.sub) return fail(res, 403, "Acesso negado.");

    const user = db.users.find((u) => u.id === auth.sub);
    if (!user) return fail(res, 404, "Usuário não encontrado.");

    if (req.body.name !== undefined) {
      assertValidName(String(req.body.name));
      user.name = String(req.body.name).trim();
    }
    if (req.body.email !== undefined) {
      const email = String(req.body.email).trim().toLowerCase();
      if (!isValidEmail(email)) return fail(res, 400, "E-mail inválido.");
      if (db.users.some((u) => u.email === email && u.id !== user.id)) return fail(res, 409, "E-mail já cadastrado.");
      user.email = email;
    }
    if (req.body.cpf !== undefined) {
      const cpf = String(req.body.cpf);
      if (!isValidCpf(cpf)) return fail(res, 400, "CPF inválido.");
      const digits = onlyDigits(cpf);
      if (db.users.some((u) => u.cpf === digits && u.id !== user.id)) return fail(res, 409, "CPF já cadastrado.");
      user.cpf = digits;
    }

    await writeDb(db);
    return ok(res, { user: { id: user.id, name: user.name, email: user.email, cpf: user.cpf } });
  } catch (e) {
    return fail(res, 400, e?.message || "Erro ao atualizar.");
  }
});

app.delete("/accounts/:id", async (req, res) => {
  try {
    const auth = requireAuth(req);
    const db = await readDb();
    const account = db.accounts.find((a) => a.id === req.params.id && !a.closedAt);
    if (!account) return fail(res, 404, "Conta não encontrada.");
    if (account.userId !== auth.sub) return fail(res, 403, "Acesso negado.");

    account.closedAt = new Date().toISOString();
    await writeDb(db);
    return ok(res, { ok: true });
  } catch (e) {
    return fail(res, 400, e?.message || "Erro ao excluir conta.");
  }
});

// Depósito / Saque
app.post("/accounts/:id/deposit", async (req, res) => {
  try {
    const auth = requireAuth(req);
    const db = await readDb();
    const account = db.accounts.find((a) => a.id === req.params.id && !a.closedAt);
    if (!account) return fail(res, 404, "Conta não encontrada.");
    if (account.userId !== auth.sub) return fail(res, 403, "Acesso negado.");

    const tx = deposit(db, req.params.id, Number(req.body.amount));
    await writeDb(db);
    return created(res, { transaction: tx });
  } catch (e) {
    return fail(res, 400, e?.message || "Erro no depósito.");
  }
});

app.post("/accounts/:id/withdraw", async (req, res) => {
  try {
    const auth = requireAuth(req);
    const db = await readDb();
    const account = db.accounts.find((a) => a.id === req.params.id && !a.closedAt);
    if (!account) return fail(res, 404, "Conta não encontrada.");
    if (account.userId !== auth.sub) return fail(res, 403, "Acesso negado.");

    const tx = withdraw(db, req.params.id, Number(req.body.amount));
    await writeDb(db);
    return created(res, { transaction: tx });
  } catch (e) {
    return fail(res, 400, e?.message || "Erro no saque.");
  }
});

// Transferência
app.post("/transfer", async (req, res) => {
  try {
    const auth = requireAuth(req);
    const { fromAccountId, toAccountId, amount } = req.body || {};
    const db = await readDb();

    const from = db.accounts.find((a) => a.id === fromAccountId && !a.closedAt);
    if (!from) return fail(res, 404, "Conta de origem não encontrada.");
    if (from.userId !== auth.sub) return fail(res, 403, "Acesso negado.");

    const to = db.accounts.find((a) => a.id === toAccountId && !a.closedAt);
    if (!to) return fail(res, 404, "Conta de destino não encontrada.");

    const tx = transfer(db, String(fromAccountId), String(toAccountId), Number(amount));
    await writeDb(db);
    return created(res, { transaction: tx });
  } catch (e) {
    return fail(res, 400, e?.message || "Erro na transferência.");
  }
});

// Saldo / Extrato
app.get("/accounts/:id/balance", async (req, res) => {
  try {
    const auth = requireAuth(req);
    const db = await readDb();
    const account = db.accounts.find((a) => a.id === req.params.id && !a.closedAt);
    if (!account) return fail(res, 404, "Conta não encontrada.");
    if (account.userId !== auth.sub) return fail(res, 403, "Acesso negado.");

    return ok(res, { balance: getAccountBalance(db, req.params.id) });
  } catch (e) {
    return fail(res, 400, e?.message || "Erro ao consultar saldo.");
  }
});

app.get("/accounts/:id/statement", async (req, res) => {
  try {
    const auth = requireAuth(req);
    const db = await readDb();
    const account = db.accounts.find((a) => a.id === req.params.id && !a.closedAt);
    if (!account) return fail(res, 404, "Conta não encontrada.");
    if (account.userId !== auth.sub) return fail(res, 403, "Acesso negado.");

    return ok(res, { statement: getAccountStatement(db, req.params.id) });
  } catch (e) {
    return fail(res, 400, e?.message || "Erro ao emitir extrato.");
  }
});

const port = Number(process.env.PORT || 3333);
app.listen(port, () => {
  console.log(`Senaibank API rodando em http://localhost:${port}`);
});

