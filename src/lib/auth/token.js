// =============================================================
// Funções para CRIAR e LER tokens no formato JWT.
//
// ATENÇÃO: é um JWT de MENTIRA (a assinatura é falsa), só para estudo.
// Num projeto real quem cria e assina o token é o BACKEND. O front
// só LÊ o conteúdo (ex: para saber quando ele expira).
//
// Um JWT tem 3 partes separadas por ponto:
//   header.payload.assinatura
//   - header:     informações do token (tipo, algoritmo)
//   - payload:    os dados (id do usuário, quando expira...)
//   - assinatura: garante que ninguém alterou o token
//
// Cole um token em https://jwt.io para ver o que tem dentro.
// =============================================================

// Transforma um objeto em texto "base64url" (o formato do JWT).
// Ex: { a: 1 } -> "eyJhIjoxfQ"
function toBase64Url(object) {
  const json = JSON.stringify(object);
  return Buffer.from(json).toString("base64url");
}

// Pega o horário atual em SEGUNDOS (o JWT usa segundos, não milissegundos)
function nowInSeconds() {
  return Math.floor(Date.now() / 1000);
}

// -------------------------------------------------------------
// Cria um token.
//   data             -> o que vai dentro (ex: { sub: "1", type: "access" })
//   expiresInSeconds -> quanto tempo o token vale (ex: 60)
// -------------------------------------------------------------
export function createToken(data, expiresInSeconds) {
  const now = nowInSeconds();

  const header = { alg: "none", typ: "JWT" };
  const payload = {
    sub: data.sub, // "subject": de quem é o token (id do usuário)
    type: data.type, // "access" ou "refresh"
    iat: now, // "issued at": quando foi criado
    exp: now + expiresInSeconds, // "expiration": quando expira
  };

  return `${toBase64Url(header)}.${toBase64Url(payload)}.mock-signature`;
}

// -------------------------------------------------------------
// Lê o payload (a parte do meio) do token.
// Devolve null se o token estiver vazio ou quebrado.
// -------------------------------------------------------------
export function decodeToken(token) {
  try {
    const payloadPart = token.split(".")[1]; // pega a 2ª parte
    const json = Buffer.from(payloadPart, "base64url").toString("utf-8");
    return JSON.parse(json);
  } catch {
    // Qualquer erro (token undefined, texto aleatório...) = inválido
    return null;
  }
}

// -------------------------------------------------------------
// Quantos segundos faltam para o token expirar (0 se já expirou).
// -------------------------------------------------------------
export function secondsUntilExpiration(token) {
  const payload = decodeToken(token);

  if (!payload) {
    return 0; // token inválido conta como "já expirou"
  }

  const secondsLeft = payload.exp - nowInSeconds();

  if (secondsLeft < 0) {
    return 0;
  }
  return secondsLeft;
}

// -------------------------------------------------------------
// true = o token existe e ainda não expirou
// -------------------------------------------------------------
export function isTokenValid(token) {
  return secondsUntilExpiration(token) > 0;
}
