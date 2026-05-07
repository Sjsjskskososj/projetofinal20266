// POST /api/transfer - transfere valores entre contas do próprio usuário.
import { NextRequest } from "next/server";
import { readDb, writeDb } from "@/lib/storage";
import { transfer } from "@/lib/bank";
import { jsonCreated, jsonError, requireAuth } from "@/app/api/_utils";

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const body = (await req.json()) as {
      fromAccountId?: string;
      toAccountId?: string;
      amount?: number;
    };

    const fromId = body.fromAccountId ?? "";
    const toId = body.toAccountId ?? "";
    const amount = Number(body.amount);

    const db = await readDb();
    const from = db.accounts.find((a) => a.id === fromId && !a.closedAt);
    if (!from) return jsonError("Conta de origem não encontrada.", 404);
    if (from.userId !== auth.sub) return jsonError("Acesso negado.", 403);

    const to = db.accounts.find((a) => a.id === toId && !a.closedAt);
    if (!to) return jsonError("Conta de destino não encontrada.", 404);

    // Aqui a regra permite transferir para qualquer conta existente.
    const tx = transfer(db, fromId, toId, amount);
    await writeDb(db);

    return jsonCreated({ transaction: tx });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro na transferência.";
    return jsonError(message, 400);
  }
}

