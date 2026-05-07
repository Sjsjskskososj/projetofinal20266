// Funções utilitárias para as rotas de API (respostas e autenticação).
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function jsonOk(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, { status: 200, ...init });
}

export function jsonCreated(data: unknown) {
  return NextResponse.json(data, { status: 201 });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function getBearerToken(req: NextRequest) {
  const header = req.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1];
}

export function requireAuth(req: NextRequest) {
  const token = getBearerToken(req);
  if (!token) throw new Error("Token não informado.");
  return verifyToken(token);
}

