// =============================================================
// DASHBOARD: mostra os 2 jeitos de buscar dados.
//
//  🖥️ SERVER-SIDE: esta página é "async" e busca o usuário no
//     servidor, ANTES do HTML chegar ao navegador.
//  🌐 CLIENT-SIDE: o <ClientUserCard /> busca no navegador,
//     depois que a página já carregou (quando clica no botão).
// =============================================================
import { getCurrentUser, getTokenInfo } from "@/lib/auth/session";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenCountdown } from "@/components/auth/token-countdown";
import { ClientUserCard } from "@/components/auth/client-user-card";

export const metadata = { title: "Dashboard | Bootcamp" };

export default async function DashboardPage() {
  // Tudo aqui roda no SERVIDOR
  const user = await getCurrentUser();
  const token = await getTokenInfo();
  const renderedAt = new Date().toLocaleTimeString("pt-BR");

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Olá, {user.name} 👋</h1>
        <p className="text-muted-foreground">Você está numa rota privada.</p>
      </div>

      <TokenCountdown expiresAt={token.expiresAt} durationSeconds={token.durationSeconds} />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Badge>Server-side</Badge>
            <CardTitle>Dados buscados no servidor</CardTitle>
            <CardDescription>
              Renderizado às {renderedAt}. Recarregue a página (F5) e veja o horário mudar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
              {JSON.stringify(user, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <ClientUserCard />
      </div>
    </>
  );
}
