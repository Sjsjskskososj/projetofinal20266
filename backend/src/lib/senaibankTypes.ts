// Tipos base usados nas regras e APIs do SenaiBank.

export type User = {
  id: string;
  name: string;
  email: string;
  cpf: string; // sempre apenas dígitos
  passwordHash: string;
  createdAt: string; // ISO
};

export type BankAccount = {
  id: string;
  userId: string;
  createdAt: string; // ISO
  closedAt?: string; // ISO (quando excluída)
};

export type TransactionType = "deposit" | "withdraw" | "transfer";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  fromAccountId?: string;
  toAccountId?: string;
  createdAt: string; // ISO
};

export type SenaibankDb = {
  users: User[];
  accounts: BankAccount[];
  // saldo é derivado do extrato; manter histórico facilita auditoria e testes
  transactions: Transaction[];
};

