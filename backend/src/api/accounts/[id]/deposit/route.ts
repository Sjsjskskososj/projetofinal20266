// POST /api/accounts/:id/deposit - deposita em uma conta do próprio usuário.
import { NextRequest } from "next/server";
import { readDb, writeDb } from "@/lib/storage";
import { deposit } from "@/lib/bank";
import { jsonCreated, jsonError, requireAuth } from "@/app/api/_utils";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(req);
    const { id } = await params;
    const body = (await req.json()) as { amount?: number };

    const db = await readDb();
    const account = db.accounts.find((a) => a.id === id && !a.closedAt);
    if (!account) return jsonError("Conta não encontrada.", 404);
    if (account.userId !== auth.sub) return jsonError("Acesso negado.", 403);

    const tx = deposit(db, id, Number(body.amount));
    await writeDb(db);

    return jsonCreated({ transaction: tx });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro no depósito.";
    return jsonError(message, 400);
  }
}

