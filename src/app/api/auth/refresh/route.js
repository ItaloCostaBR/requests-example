// =============================================================
// 🔐 BFF: REFRESH (chamado pelo apiFetch, no navegador)
// POST /api/auth/refresh
//
// O navegador NÃO consegue ler o refresh token (cookie httpOnly).
// Então ele pede para o servidor: "renova pra mim?".
// O servidor lê o cookie, chama a API de auth e grava os cookies novos.
// =============================================================
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { refreshRequest } from "@/lib/auth/auth-api";
import { REFRESH_TOKEN_COOKIE, setAuthCookies, clearAuthCookies } from "@/lib/auth/cookies";

// Resposta de "sessão acabou": 401 + apaga os cookies
function sessionExpiredResponse() {
  const response = NextResponse.json({ message: "Sessão expirada." }, { status: 401 });
  clearAuthCookies(response);
  return response;
}

export async function POST() {
  // 1. Lê o refresh token do cookie
  const cookieStore = await cookies();
  const refreshCookie = cookieStore.get(REFRESH_TOKEN_COOKIE);

  if (!refreshCookie) {
    return sessionExpiredResponse();
  }

  // 2. Pede tokens novos para a API de auth
  const newTokens = await refreshRequest(refreshCookie.value);

  if (!newTokens) {
    return sessionExpiredResponse();
  }

  // 3. Grava os tokens novos nos cookies
  const response = NextResponse.json({ ok: true });
  setAuthCookies(response, newTokens);
  return response;
}
