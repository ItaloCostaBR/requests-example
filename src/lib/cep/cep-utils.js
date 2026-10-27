// =============================================================
// Regras de CEP usadas no FRONT e no BACK.
//
// Por que validar nos dois lados?
//  - No front: o usuário recebe um aviso rápido (nem faz a requisição).
//  - No back: o front pode ser burlado (DevTools, Postman, curl...),
//    então o servidor SEMPRE confere de novo.
// =============================================================

// Deixa só os números: "01001-000" -> "01001000"
// (\D na expressão regular = "tudo que NÃO é número")
export function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

// CEP válido = exatamente 8 números
export function isValidCep(value) {
  return onlyDigits(value).length === 8;
}

// Máscara enquanto digita: "01001000" -> "01001-000"
export function maskCep(value) {
  const digits = onlyDigits(value).slice(0, 8); // no máximo 8 números

  // Até 5 números ainda não tem traço: "01001"
  if (digits.length <= 5) {
    return digits;
  }

  // Mais de 5: coloca o traço depois do 5º número
  const firstPart = digits.slice(0, 5);
  const secondPart = digits.slice(5);
  return `${firstPart}-${secondPart}`;
}
