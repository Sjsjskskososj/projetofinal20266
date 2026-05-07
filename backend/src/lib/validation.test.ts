// Testes unitários das validações principais (CPF, e-mail, valor).
import { assertValidAmount, isValidCpf, isValidEmail } from "./validation";

test("valida e-mail simples", () => {
  expect(isValidEmail("teste@exemplo.com")).toBe(true);
  expect(isValidEmail("sem-arroba.com")).toBe(false);
});

test("valida CPF (exemplo válido e inválido)", () => {
  // 529.982.247-25 é um CPF usado frequentemente como exemplo válido.
  expect(isValidCpf("529.982.247-25")).toBe(true);
  expect(isValidCpf("111.111.111-11")).toBe(false);
});

test("valor precisa estar no intervalo permitido", () => {
  expect(() => assertValidAmount(0.009)).toThrow();
  expect(() => assertValidAmount(0.01)).not.toThrow();
  expect(() => assertValidAmount(1_000_000)).not.toThrow();
  expect(() => assertValidAmount(1_000_000.01)).toThrow();
});

