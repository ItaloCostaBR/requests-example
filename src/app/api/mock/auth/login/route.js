// =============================================================
// 🎭 API MOCK: finge ser o backend de autenticação.
// POST /api/mock/auth/login   body: { email, password }
//
// O NAVEGADOR NÃO CHAMA ESTA ROTA! Quem chama é o nosso servidor
// (src/app/api/auth/login). Num projeto real esta API estaria em
// outro servidor (Java, Node, .NET...).
// =============================================================
import { NextResponse } from "next/server";
import { users, toPublicUser } from "@/lib/mock/users";
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "@/lib/mock/token-config";
import { createToken } from "@/lib/auth/token";

export async function POST(request) {
  const body = await request.json();

  // Procura um usuário com esse e-mail E essa senha
  const user = users.find((u) => u.email === body.email && u.password === body.password);

  if (!user) {
    return NextResponse.json({ message: "E-mail ou senha inválidos." }, { status: 401 });
  }

  // Cria os 2 tokens. "sub" (subject) = id do dono do token
  const accessToken = createToken({ sub: user.id, type: "access" }, ACCESS_TOKEN_TTL);
  const refreshToken = createToken({ sub: user.id, type: "refresh" }, REFRESH_TOKEN_TTL);

  return NextResponse.json({
    accessToken,
    refreshToken,
    user: toPublicUser(user),
  });
}
