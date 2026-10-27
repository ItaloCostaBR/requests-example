// =============================================================
// Funções de sessão para o SERVIDOR
// (Server Components, layouts e Route Handlers).
//
// "server-only": se alguém importar este arquivo num Client
// Component, o build QUEBRA. É uma trava de segurança.
// =============================================================
import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "./cookies";
import { decodeToken, isTokenValid } from "./token";
import { meRequest } from "./auth-api";

// Lê o access token guardado no cookie
async function getAccessToken() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ACCESS_TOKEN_COOKIE);

  if (!cookie) {
    return null;
  }
  return cookie.value;
}

// -------------------------------------------------------------
// getCurrentUser: devolve o usuário logado, ou null.
// É a "porta de entrada" de TUDO que é protegido.
//
// Faz 2 checagens:
//   1. Local: o token existe e não expirou? (rápido, sem internet)
//   2. API de auth: o backend aceita esse token?
//
// Por que o "cache"? O layout e a página pedem o usuário na mesma
// requisição. Com o cache, a API é chamada só 1 vez.
// -------------------------------------------------------------
export const getCurrentUser = cache(async () => {
  const accessToken = await getAccessToken();

  if (!isTokenValid(accessToken)) {
    return null;
  }

  return meRequest(accessToken);
});

// -------------------------------------------------------------
// getTokenInfo: dados do access token, só para MOSTRAR na tela
// (usado pelo contador do dashboard e da página de CEP).
// -------------------------------------------------------------
export async function getTokenInfo() {
  const accessToken = await getAccessToken();
  const payload = decodeToken(accessToken);

  if (!payload) {
    return { expiresAt: null, durationSeconds: null };
  }

  // No JWT, "exp" (expira em) e "iat" (criado em) estão em SEGUNDOS
  return {
    expiresAt: payload.exp * 1000, // convertendo para milissegundos
    durationSeconds: payload.exp - payload.iat,
  };
}
