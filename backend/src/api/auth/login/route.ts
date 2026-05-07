// POST /api/auth/login - autentica e devolve JWT.
import { NextRequest } from "next/server";
import { comparePassword, signToken } from "@/lib/auth";
import { onlyDigits } from "@/lib/validation";
import { readDb } from "@/lib/storage";
import { jsonOk, jsonError } from "@/app/api/_utils";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { emailOrCpf?: string; password?: string };
    const emailOrCpf = (body.emailOrCpf ?? "").trim().toLowerCase();
    const password = body.password ?? "";

    const db = await readDb();
    const cpfDigits = onlyDigits(emailOrCpf);

    const user =
      db.users.find((u) => u.email === emailOrCpf) ??
      (cpfDigits.length ? db.users.find((u) => u.cpf === cpfDigits) : undefined);

    if (!user) return jsonError("Usuário não encontrado.", 404);

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return jsonError("Senha inválida.", 401);

    const token = signToken({ sub: user.id, email: user.email });
    return jsonOk({ token });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao autenticar.";
    return jsonError(message, 400);
  }
}

