// =============================================================
// 🎭 API MOCK: gera tokens NOVOS a partir do refresh token.
// POST /api/mock/auth/refresh   body: { refreshToken }
// =============================================================
import { NextResponse } from "next/server";
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "@/lib/mock/token-config";
import { createToken, decodeToken, isTokenValid } from "@/lib/auth/token";

export async function POST(request) {
  const body = await request.json();
  const refreshToken = body.refreshToken;

  // 1. O token expirou ou é lixo?
  if (!isTokenValid(refreshToken)) {
    return NextResponse.json({ message: "Refresh token inválido ou expirado." }, { status: 401 });
  }

  // 2. É mesmo um refresh token? (não aceitamos um access token aqui)
  const payload = decodeToken(refreshToken);
  if (payload.type !== "refresh") {
    return NextResponse.json({ message: "Isso não é um refresh token." }, { status: 401 });
  }

  console.info(`[mock-api] refresh realizado para o usuário ${payload.sub}`);

  // 3. Tudo certo: cria tokens novos para o mesmo usuário
  return NextResponse.json({
    accessToken: createToken({ sub: payload.sub, type: "access" }, ACCESS_TOKEN_TTL),
    refreshToken: createToken({ sub: payload.sub, type: "refresh" }, REFRESH_TOKEN_TTL),
  });
}
