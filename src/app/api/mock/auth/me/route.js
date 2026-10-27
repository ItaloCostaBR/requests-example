// =============================================================
// 🎭 API MOCK: rota PROTEGIDA que devolve o usuário logado.
// GET /api/mock/auth/me
// header: Authorization: Bearer <accessToken>
// =============================================================
import { NextResponse } from "next/server";
import { users, toPublicUser } from "@/lib/mock/users";
import { decodeToken, isTokenValid } from "@/lib/auth/token";

export async function GET(request) {
  // O header vem assim: "Bearer eyJhbGciOi..."
  // Tiramos o "Bearer " para sobrar só o token.
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.replace("Bearer ", "");

  // 1. O token expirou ou é lixo?
  if (!isTokenValid(token)) {
    return NextResponse.json({ message: "Token inválido ou expirado." }, { status: 401 });
  }

  // 2. É mesmo um access token?
  const payload = decodeToken(token);
  if (payload.type !== "access") {
    return NextResponse.json({ message: "Isso não é um access token." }, { status: 401 });
  }

  // 3. Procura o dono do token
  const user = users.find((u) => u.id === payload.sub);
  if (!user) {
    return NextResponse.json({ message: "Usuário não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ user: toPublicUser(user) });
}
