// GET /api/accounts/:id/balance - consulta saldo de uma conta.
import { NextRequest } from "next/server";
import { readDb } from "@/lib/storage";
import { getAccountBalance } from "@/lib/bank";
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

    const balance = getAccountBalance(db, id);
    return jsonOk({ balance });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao consultar saldo.";
    return jsonError(message, 401);
  }
}

