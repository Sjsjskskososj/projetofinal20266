// Cadastro/login com bcrypt + JWT (como pedido no enunciado).
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import type { User } from "./senaibankTypes";
import { isValidCpf, isValidEmail, onlyDigits, assertValidName } from "./validation";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";

export type JwtPayload = {
  sub: string; // userId
  email: string;
};

export function hashPassword(password: string) {
  if (password.length < 6) throw new Error("Senha deve ter pelo menos 6 caracteres.");
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function newUserId() {
  return crypto.randomUUID();
}

export async function buildNewUser(input: {
  name: string;
  email: string;
  cpf: string;
  password: string;
}): Promise<User> {
  assertValidName(input.name);
  if (!isValidEmail(input.email)) throw new Error("E-mail inválido.");
  if (!isValidCpf(input.cpf)) throw new Error("CPF inválido.");

  const passwordHash = await hashPassword(input.password);
  return {
    id: newUserId(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    cpf: onlyDigits(input.cpf),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
}

