// =============================================================
// Funções que conversam com a API de autenticação ("o backend").
//
// A URL vem do .env (AUTH_API_URL). Hoje ela aponta para a API
// mockada em src/app/api/mock. Para usar um backend de verdade,
// basta trocar a URL no .env — nenhum código muda.
//
// Só roda no SERVIDOR (proxy, route handlers e server components).
// =============================================================

const AUTH_API_URL = process.env.AUTH_API_URL;

// POST /auth/login -> { accessToken, refreshToken, user }
export async function loginRequest(email, password) {
  const response = await fetch(`${AUTH_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

// POST /auth/refresh -> { accessToken, refreshToken }
// Retorna null se o refresh token for inválido/expirado.
export async function refreshRequest(refreshToken) {
  try {
    const response = await fetch(`${AUTH_API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("[auth-api] falha no refresh:", error.message);
    return null;
  }
}

// GET /auth/me -> { user }
// Exemplo de rota protegida: precisa mandar o token no header.
export async function meRequest(accessToken) {
  try {
    const response = await fetch(`${AUTH_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("[auth-api] falha ao buscar usuário:", error.message);
    return null;
  }
}
