// =============================================================
// Onde os tokens ficam guardados: COOKIES httpOnly.
//
// httpOnly = o JavaScript do navegador NÃO consegue ler o cookie
// (document.cookie não mostra). Isso protege o token contra
// ataques XSS. Quem lê é só o servidor (proxy, route handlers,
// server components).
// =============================================================
import { secondsUntilExpiration } from "./token";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

function cookieOptions(token) {
  return {
    httpOnly: true, // JS do navegador não acessa
    secure: process.env.COOKIE_SECURE === "true", // só HTTPS (true em produção)
    sameSite: "lax", // proteção básica contra CSRF
    path: "/", // vale para o site inteiro
    maxAge: secondsUntilExpiration(token), // cookie some junto com o token
  };
}

// Grava os 2 tokens em cookies na resposta.
//   response -> a resposta que vai para o navegador (NextResponse)
//   tokens   -> { accessToken, refreshToken }
export function setAuthCookies(response, tokens) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, cookieOptions(tokens.accessToken));
  response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, cookieOptions(tokens.refreshToken));
}

// Apaga os 2 cookies (usado no logout e quando a sessão expira)
export function clearAuthCookies(response) {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
}
