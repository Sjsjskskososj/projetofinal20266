// Persistência simples em arquivo JSON (bom o suficiente para o projeto).
import { promises as fs } from "node:fs";
import path from "node:path";
import type { SenaibankDb } from "./senaibankTypes";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "senaibank.json");

function emptyDb(): SenaibankDb {
  return { users: [], accounts: [], transactions: [] };
}

export async function readDb(): Promise<SenaibankDb> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(raw) as SenaibankDb;
  } catch (err: unknown) {
    // Se o arquivo ainda não existe, começa “limpo”.
    const code = (err as { code?: string })?.code;
    if (code === "ENOENT") return emptyDb();
    throw err;
  }
}

export async function writeDb(db: SenaibankDb): Promise<void> {
  await fs.mkdir(DB_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

