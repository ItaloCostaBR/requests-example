// =============================================================
// 🔐 BFF — QUEM SOU EU (para o client-side)
// GET /api/auth/me
//
// Se o token venceu, devolve 401 -> o apiFetch faz o refresh
// e repete a chamada automaticamente.
// =============================================================
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  return NextResponse.json({ user, consultadoEm: new Date().toISOString() });
}
