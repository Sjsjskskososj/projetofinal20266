// GET /api/accounts - lista as contas do usuário logado
// POST /api/accounts - cria uma conta para o usuário logado
import { NextRequest } from "next/server";
import { readDb, writeDb } from "@/lib/storage";
import { jsonCreated, jsonError, jsonOk, requireAuth } from "@/app/api/_utils";
import { newId, nowIso } from "@/lib/bank";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const db = await readDb();

    const accounts = db.accounts.filter((a) => a.userId === auth.sub && !a.closedAt);
    return jsonOk({ accounts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao listar contas.";
    return jsonError(message, 401);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const db = await readDb();

    const user = db.users.find((u) => u.id === auth.sub);
    if (!user) return jsonError("Usuário não encontrado.", 404);

    const account = { id: newId(), userId: user.id, createdAt: nowIso() };
    db.accounts.push(account);
    await writeDb(db);

    return jsonCreated({ account });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao criar conta.";
    return jsonError(message, 401);
  }
}

