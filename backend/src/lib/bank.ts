// Regras principais do banco (transações, saldo e busca de extrato).
import crypto from "node:crypto";
import type { SenaibankDb, Transaction } from "./senaibankTypes";
import { assertValidAmount } from "./validation";

export function nowIso() {
  return new Date().toISOString();
}

export function newId() {
  return crypto.randomUUID();
}

export function listAccounts(db: SenaibankDb) {
  return db.accounts.filter((a) => !a.closedAt);
}

export function accountExists(db: SenaibankDb, accountId: string) {
  return db.accounts.some((a) => a.id === accountId && !a.closedAt);
}

export function getAccountBalance(db: SenaibankDb, accountId: string) {
  if (!accountExists(db, accountId)) throw new Error("Conta não encontrada.");

  // Saldo = entradas - saídas baseadas no histórico.
  let balance = 0;
  for (const t of db.transactions) {
    if (t.type === "deposit" && t.toAccountId === accountId) balance += t.amount;
    if (t.type === "withdraw" && t.fromAccountId === accountId) balance -= t.amount;
    if (t.type === "transfer") {
      if (t.fromAccountId === accountId) balance -= t.amount;
      if (t.toAccountId === accountId) balance += t.amount;
    }
  }
  return balance;
}

export function getAccountStatement(db: SenaibankDb, accountId: string) {
  if (!accountExists(db, accountId)) throw new Error("Conta não encontrada.");

  return db.transactions
    .filter((t) => t.fromAccountId === accountId || t.toAccountId === accountId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function pushTransaction(db: SenaibankDb, tx: Omit<Transaction, "id" | "createdAt">) {
  const full: Transaction = { ...tx, id: newId(), createdAt: nowIso() };
  db.transactions.push(full);
  return full;
}

export function deposit(db: SenaibankDb, toAccountId: string, amount: number) {
  assertValidAmount(amount);
  if (!accountExists(db, toAccountId)) throw new Error("Conta de destino não encontrada.");
  return pushTransaction(db, { type: "deposit", amount, toAccountId });
}

export function withdraw(db: SenaibankDb, fromAccountId: string, amount: number) {
  assertValidAmount(amount);
  if (!accountExists(db, fromAccountId)) throw new Error("Conta não encontrada.");

  const current = getAccountBalance(db, fromAccountId);
  if (current < amount) throw new Error("Saldo insuficiente.");

  return pushTransaction(db, { type: "withdraw", amount, fromAccountId });
}

export function transfer(
  db: SenaibankDb,
  fromAccountId: string,
  toAccountId: string,
  amount: number,
) {
  assertValidAmount(amount);
  if (fromAccountId === toAccountId) throw new Error("Contas devem ser diferentes.");
  if (!accountExists(db, fromAccountId)) throw new Error("Conta de origem não encontrada.");
  if (!accountExists(db, toAccountId)) throw new Error("Conta de destino não encontrada.");

  const current = getAccountBalance(db, fromAccountId);
  if (current < amount) throw new Error("Saldo insuficiente.");

  return pushTransaction(db, { type: "transfer", amount, fromAccountId, toAccountId });
}

