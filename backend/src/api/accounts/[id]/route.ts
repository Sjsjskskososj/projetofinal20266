// PATCH /api/accounts/:id - atualiza dados do usuário dono da conta
// DELETE /api/accounts/:id - "exclui" (fecha) a conta
import { NextRequest } from "next/server";
import { readDb, writeDb } from "@/lib/storage";
import { jsonError, jsonOk, requireAuth } from "@/app/api/_utils";
import { assertValidName, isValidCpf, isValidEmail, onlyDigits } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

function mustOwnAccount(db: Awaited<ReturnType<typeof readDb>>, userId: string, accountId: string) {
  const account = db.accounts.find((a) => a.id === accountId && !a.closedAt);
  if (!account) throw new Error("Conta não encontrada.");
  if (account.userId !== userId) throw new Error("Acesso negado.");
  return account;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(req);
    const { id } = await params;

    const body = (await req.json()) as { name?: string; email?: string; cpf?: string };
    const db = await readDb();
    mustOwnAccount(db, auth.sub, id);

    const user = db.users.find((u) => u.id === auth.sub);
    if (!user) return jsonError("Usuário não encontrado.", 404);

    if (body.name !== undefined) {
      assertValidName(body.name);
      user.name = body.name.trim();
    }
    if (body.email !== undefined) {
      if (!isValidEmail(body.email)) return jsonError("E-mail inválido.", 400);
      const email = body.email.trim().toLowerCase();
      const used = db.users.some((u) => u.email === email && u.id !== user.id);
      if (used) return jsonError("E-mail já cadastrado.", 409);
      user.email = email;
    }
    if (body.cpf !== undefined) {
      if (!isValidCpf(body.cpf)) return jsonError("CPF inválido.", 400);
      const cpf = onlyDigits(body.cpf);
      const used = db.users.some((u) => u.cpf === cpf && u.id !== user.id);
      if (used) return jsonError("CPF já cadastrado.", 409);
      user.cpf = cpf;
    }

    await writeDb(db);
    return jsonOk({ user: { id: user.id, name: user.name, email: user.email, cpf: user.cpf } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao atualizar.";
    return jsonError(message, message === "Acesso negado." ? 403 : 401);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(req);
    const { id } = await params;
    const db = await readDb();

    const account = mustOwnAccount(db, auth.sub, id);
    account.closedAt = new Date().toISOString();

    await writeDb(db);
    return jsonOk({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao excluir conta.";
    return jsonError(message, message === "Acesso negado." ? 403 : 401);
  }
}

