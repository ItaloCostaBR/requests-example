// =============================================================
// Página de CEP.
// A página é um SERVER Component (pega os dados do token).
// A busca é um CLIENT Component (tem input, clique, estado...).
// =============================================================
import { getTokenInfo } from "@/lib/auth/session";
import { TokenCountdown } from "@/components/auth/token-countdown";
import { CepSearch } from "@/components/cep/cep-search";

export const metadata = { title: "Consulta de CEP | Bootcamp" };

export default async function CepPage() {
  const token = await getTokenInfo();

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Consulta de CEP 📮</h1>
        <p className="text-muted-foreground">
          Navegador → <code>/api/cep/[cep]</code> (nosso servidor, autenticado)
          → BrasilAPI
        </p>
      </div>

      <TokenCountdown
        expiresAt={token.expiresAt}
        durationSeconds={token.durationSeconds}
      />

      <CepSearch />
    </>
  );
}
