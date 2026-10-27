// =============================================================
// 🔐 BFF (Backend For Frontend): LOGIN
// POST /api/auth/login   body: { email, password }
//
// O formulário (navegador) chama ESTA rota. Ela:
//   1. repassa e-mail e senha para a API de auth (AUTH_API_URL)
//   2. recebe os tokens
//   3. guarda os tokens em cookies httpOnly
//   4. devolve para o navegador SÓ o usuário (sem os tokens!)
// =============================================================
import { NextResponse } from "next/server";
import { loginRequest } from "@/lib/auth/auth-api";
import { setAuthCookies } from "@/lib/auth/cookies";

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "E-mail e senha são obrigatórios." },
      { status: 400 },
    );
  }

  try {
    // 1. Chama a API de auth para obter tokens
    const response = await fetch(`${process.env.AUTH_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("Resposta da API de auth:", response);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Falha no login." },
        { status: response.status },
      );
    }

    const data = await response.json();
    const { accessToken, refreshToken, user } = data;

    // 2. Grava os tokens em cookies httpOnly
    const nextResponse = NextResponse.json({ user });
    setAuthCookies(nextResponse, { accessToken, refreshToken });

    // 3. Retorna apenas o usuário (sem os tokens)
    return nextResponse;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json(
      { error: "Falha no login. Verifique suas credenciais." },
      { status: 401 },
    );
  }
}
