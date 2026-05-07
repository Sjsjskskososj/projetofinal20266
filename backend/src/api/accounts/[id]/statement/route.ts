// GET /api/accounts/:id/statement - emite extrato de uma conta.
import { NextRequest } from "next/server";
import { readDb } from "@/lib/storage";
import { getAccountStatement } from "@/lib/bank";
import { jsonError, jsonOk, requireAuth } from "@/app/api/_utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(req);
    const { id } = await params;
    const db = await readDb();

    const account = db.accounts.find((a) => a.id === id && !a.closedAt);
    if (!account) return jsonError("Conta não encontrada.", 404);
    if (account.userId !== auth.sub) return jsonError("Acesso negado.", 403);

    const statement = getAccountStatement(db, id);
    return jsonOk({ statement });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao emitir extrato.";
    return jsonError(message, 401);
  }
}

