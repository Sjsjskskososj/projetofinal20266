// POST /api/auth/register - cria um usuário.
import { NextRequest } from "next/server";
import { buildNewUser } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/storage";
import { jsonCreated, jsonError } from "@/app/api/_utils";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      cpf?: string;
      password?: string;
    };

    const db = await readDb();

    const user = await buildNewUser({
      name: body.name ?? "",
      email: body.email ?? "",
      cpf: body.cpf ?? "",
      password: body.password ?? "",
    });

    const emailUsed = db.users.some((u) => u.email === user.email);
    if (emailUsed) return jsonError("E-mail já cadastrado.", 409);

    const cpfUsed = db.users.some((u) => u.cpf === user.cpf);
    if (cpfUsed) return jsonError("CPF já cadastrado.", 409);

    db.users.push(user);
    await writeDb(db);

    // Nunca devolve hash de senha.
    return jsonCreated({ id: user.id, name: user.name, email: user.email, cpf: user.cpf });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao cadastrar.";
    return jsonError(message, 400);
  }
}

