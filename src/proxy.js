// =============================================================
// 🚦 PROXY (o antigo "middleware")
//
// No Next.js 16 o arquivo "middleware.js" passou a se chamar
// "proxy.js". O funcionamento é o mesmo: este código roda no
// SERVIDOR, ANTES de cada página ser aberta.
//
// Ele decide:
//   1. Rota PRIVADA e o usuário não está logado?  -> vai para /login
//   2. Rota de VISITANTE (/login) e já está logado? -> vai para /dashboard
//   3. Access token expirou, mas o refresh ainda vale? -> renova os tokens
//      (sem o usuário perceber!)
// =============================================================
import { NextResponse } from "next/server";
import { isTokenValid } from "@/lib/auth/token";
import { refreshRequest } from "@/lib/auth/auth-api";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/auth/cookies";

// Rotas que EXIGEM login
const PRIVATE_ROUTES = ["/dashboard", "/cep"];

// Rotas só para quem NÃO está logado
const GUEST_ROUTES = ["/login"];

function isPrivateRoute(pathname) {
  return PRIVATE_ROUTES.some((route) => pathname.startsWith(route));
}

function isGuestRoute(pathname) {
  return GUEST_ROUTES.some((route) => pathname.startsWith(route));
}

export async function proxy(request) {
  // pathname = o caminho da URL. Ex: "/dashboard"
  const pathname = request.nextUrl.pathname;

  // Lê os tokens dos cookies.
  // O "?." evita erro se o cookie não existir (aí o valor fica undefined).
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  let isLoggedIn = isTokenValid(accessToken);
  let newTokens = null;

  // ---------- 🔄 Renovação dos tokens ----------
  // O access token expirou, mas o refresh token ainda vale? Renova!
  if (!isLoggedIn && isTokenValid(refreshToken)) {
    console.info(`[proxy] access token expirado em ${pathname}. Fazendo refresh...`);
    newTokens = await refreshRequest(refreshToken);

    if (newTokens) {
      isLoggedIn = true;
    }
  }

  // ---------- 🔒 Regra 1: rota privada sem login ----------
  if (isPrivateRoute(pathname) && !isLoggedIn) {
    // Monta a URL: /login?from=/dashboard (para voltar depois do login)
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);

    const response = NextResponse.redirect(loginUrl);
    clearAuthCookies(response); // apaga tokens velhos/inválidos
    return response;
  }

  // ---------- 🙅 Regra 2: tela de login já estando logado ----------
  if (isGuestRoute(pathname) && isLoggedIn) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));

    if (newTokens) {
      setAuthCookies(response, newTokens);
    }
    return response;
  }

  // ---------- ✅ Pode seguir ----------
  // Se renovamos os tokens, precisamos avisar DOIS lugares:
  if (newTokens) {
    // 1) A requisição ATUAL: assim a página (Server Component)
    //    que vai abrir agora já lê o token novo.
    request.cookies.set(ACCESS_TOKEN_COOKIE, newTokens.accessToken);
    request.cookies.set(REFRESH_TOKEN_COOKIE, newTokens.refreshToken);
    const response = NextResponse.next({ request: { headers: request.headers } });

    // 2) O NAVEGADOR: para ele guardar os cookies novos.
    setAuthCookies(response, newTokens);
    return response;
  }

  // Nada a fazer: segue para a página normalmente
  return NextResponse.next();
}

// -------------------------------------------------------------
// matcher = em quais URLs o proxy roda.
// Esta expressão quer dizer: "em tudo, MENOS":
//   - /api           -> as rotas de API se protegem sozinhas
//   - /_next/...     -> arquivos internos do Next (JS, CSS, imagens)
//   - /favicon.ico   -> o ícone da aba
// -------------------------------------------------------------
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
