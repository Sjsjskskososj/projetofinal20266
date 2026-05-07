// Testes unitários das transações (depósito/saque/transferência).
import type { SenaibankDb } from "./senaibankTypes";
import { deposit, getAccountBalance, transfer, withdraw } from "./bank";

function makeDb(): SenaibankDb {
  return {
    users: [{ id: "u1", name: "Arthur", email: "a@a.com", cpf: "12345678909", passwordHash: "x", createdAt: new Date().toISOString() }],
    accounts: [
      { id: "a1", userId: "u1", createdAt: new Date().toISOString() },
      { id: "a2", userId: "u1", createdAt: new Date().toISOString() },
    ],
    transactions: [],
  };
}

test("deposit aumenta saldo", () => {
  const db = makeDb();
  deposit(db, "a1", 100);
  expect(getAccountBalance(db, "a1")).toBe(100);
});

test("withdraw diminui saldo", () => {
  const db = makeDb();
  deposit(db, "a1", 100);
  withdraw(db, "a1", 40);
  expect(getAccountBalance(db, "a1")).toBe(60);
});

test("withdraw bloqueia saldo insuficiente", () => {
  const db = makeDb();
  expect(() => withdraw(db, "a1", 10)).toThrow("Saldo insuficiente.");
});

test("transfer move saldo entre contas", () => {
  const db = makeDb();
  deposit(db, "a1", 200);
  transfer(db, "a1", "a2", 70);
  expect(getAccountBalance(db, "a1")).toBe(130);
  expect(getAccountBalance(db, "a2")).toBe(70);
});

