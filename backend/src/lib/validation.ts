// Validações pedidas no enunciado (CPF, e-mail, valores e caracteres).

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function isValidEmail(email: string) {
  // Regex simples e prática (não tenta cobrir 100% do RFC).
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidCpf(cpfRaw: string) {
  const cpf = onlyDigits(cpfRaw);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcDigit = (base: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < base.length; i++) {
      total += Number(base[i]) * (factor - i);
    }
    const mod = total % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const d1 = calcDigit(cpf.slice(0, 9), 10);
  const d2 = calcDigit(cpf.slice(0, 10), 11);
  return cpf.endsWith(`${d1}${d2}`);
}

export function assertValidAmount(amount: number) {
  // Regra: permitir valores entre $0.01 e $1.000.000,00
  if (!Number.isFinite(amount)) throw new Error("Valor inválido.");
  if (amount < 0.01 || amount > 1_000_000) {
    throw new Error("Valor deve estar entre 0.01 e 1.000.000.");
  }
}

export function assertValidName(name: string) {
  // Regra: proibir caracteres inválidos (nome só com letras, espaço, hífen e apóstrofo).
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Nome é obrigatório.");
  if (!/^[A-Za-zÀ-ÿ' -]+$/.test(trimmed)) {
    throw new Error("Nome contém caracteres inválidos.");
  }
}

