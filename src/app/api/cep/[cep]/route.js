// =============================================================
// 📮 BFF: CONSULTA DE CEP (rota AUTENTICADA)
// GET /api/cep/01001000
//
// Por que o front não chama a BrasilAPI direto?
//  - A URL da API externa fica escondida no servidor (.env)
//  - Só quem está logado pode usar
//  - Validamos o CEP de novo (o front pode ser burlado)
//  - Tratamos os erros e devolvemos mensagens amigáveis
//  - Padronizamos a resposta (o front não depende da BrasilAPI)
//
// Atenção: o proxy NÃO roda nas rotas /api (veja o "matcher"
// em src/proxy.js). Por isso esta rota confere o login sozinha.
// =============================================================
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { isValidCep, onlyDigits } from "@/lib/cep/cep-utils";
import { findCep } from "@/lib/cep/cep-service";

export async function GET(request, { params }) {
  // ---------- 1. Está logado? ----------
  // Se não estiver, devolve 401. No navegador, o apiFetch vê o 401,
  // renova o token e chama esta rota DE NOVO, sozinho.
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  // ---------- 2. O CEP é válido? ----------
  // params = a parte dinâmica da URL. Em /api/cep/01001000 -> { cep: "01001000" }
  const { cep } = await params;
  const cleanCep = onlyDigits(cep);

  if (!isValidCep(cleanCep)) {
    return NextResponse.json({ message: "CEP inválido. Use 8 números." }, { status: 400 });
  }

  // ---------- 3. Busca o endereço ----------
  const result = await findCep(cleanCep);
  console.info(`[api/cep] ${user.email} consultou o CEP ${cleanCep} -> ${result.status}`);

  return NextResponse.json(result.body, { status: result.status });
}
