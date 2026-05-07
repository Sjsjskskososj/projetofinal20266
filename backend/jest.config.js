// Configuração do Jest para testes unitários em TypeScript (Node).
/** @type {import("jest").Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(test).ts"],
  clearMocks: true,
  rootDir: ".",
};

