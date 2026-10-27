// =============================================================
// apiFetch: um "fetch" com renovação automática de token.
// Roda no NAVEGADOR (client-side).
//
// Use no lugar do fetch sempre que chamar uma rota protegida
// do nosso /api (ex: /api/cep/01001000).
//
// Passo a passo:
//   1. Faz a requisição normalmente (os cookies vão sozinhos).
//   2. Se a resposta for 401, o token expirou.
//      Então pedimos ao servidor para renovar: /api/auth/refresh
//   3. Renovou? Repetimos a MESMA requisição (só 1 vez).
//   4. Não renovou? A sessão acabou: vamos para o /login.
//
// Parâmetros:
//   url     -> endereço da API (ex: "/api/cep/01001000")
//   options -> opções do fetch (method, body...). Opcional.
//   onStep  -> função chamada a cada passo, para mostrar na tela. Opcional.
// =============================================================

export async function apiFetch(url, options = {}, onStep = () => {}) {
  // Mostra o passo no console do navegador e avisa quem chamou
  function logStep(message) {
    console.info(`[apiFetch] ${message}`);
    onStep(message);
  }

  // ---------- 1ª tentativa ----------
  const firstResponse = await fetch(url, options);
  logStep(`${url} -> ${firstResponse.status}`);

  // Não é 401? Então não é problema de token: devolve como veio.
  if (firstResponse.status !== 401) {
    return firstResponse;
  }

  // ---------- Token expirado: pede um token novo ----------
  logStep("401: token expirado. Renovando em /api/auth/refresh...");
  const refreshResponse = await fetch("/api/auth/refresh", { method: "POST" });

  // Não conseguiu renovar? A sessão acabou de vez.
  if (!refreshResponse.ok) {
    logStep("Não foi possível renovar. Indo para o login.");

    // Volta para esta mesma página depois de logar (?from=...)
    const currentPage = encodeURIComponent(window.location.pathname);
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/login?from=${currentPage}`;
    return firstResponse;
  }

  // ---------- 2ª tentativa (a última), já com o token novo ----------
  logStep("Token renovado! Repetindo a requisição...");
  const secondResponse = await fetch(url, options);
  logStep(`${url} -> ${secondResponse.status} (repetição)`);

  return secondResponse;
}
