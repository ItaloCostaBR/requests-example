// =============================================================
// Página de LOGIN (rota de visitante).
//
// Pastas entre parênteses, como (guest), NÃO aparecem na URL.
// Elas servem só para organizar. A URL aqui é apenas /login.
//
// Esta página é um SERVER Component. O formulário precisa de
// interatividade (digitar, clicar), então ele é um CLIENT Component.
//
// Por que o <Suspense>? Com Cache Components, ler searchParams fora
// de um <Suspense> quebra o build: a URL só existe na requisição.
// =============================================================
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Entrar | Bootcamp" };

// Para onde mandar o usuário depois do login.
// O proxy coloca na URL: /login?from=/cep
function getRedirectPath(from) {
  // Não veio nada? Vai para o dashboard.
  if (!from) {
    return "/dashboard";
  }

  // Segurança: só aceitamos caminhos do NOSSO site ("/cep").
  // Um link como "//site-malicioso.com" levaria para outro site!
  if (!from.startsWith("/") || from.startsWith("//")) {
    return "/dashboard";
  }

  return from;
}

export default function LoginPage({ searchParams }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <Suspense>
        <LoginFormWithRedirect searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function LoginFormWithRedirect({ searchParams }) {
  // searchParams = os parâmetros da URL (?from=...)
  const params = await searchParams;
  const redirectTo = getRedirectPath(params.from);

  return <LoginForm redirectTo={redirectTo} />;
}
