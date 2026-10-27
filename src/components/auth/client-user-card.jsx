"use client";
// =============================================================
// Busca o usuário pelo CLIENT-SIDE (no navegador, ao clicar).
//
// Usa o apiFetch: se o token tiver expirado, ele renova e repete
// a chamada sozinho. Veja os passos na linha do tempo da tela ou
// no DevTools (abas Network e Console).
// =============================================================
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestTimeline } from "@/components/shared/request-timeline";

export function ClientUserCard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([]);

  // Adiciona um passo no fim da lista da linha do tempo
  function addStep(step) {
    setSteps((oldSteps) => [...oldSteps, step]);
  }

  async function handleClick() {
    setSteps([]);
    setLoading(true);

    const response = await apiFetch("/api/auth/me", {}, addStep);
    const json = await response.json();

    setData(json);
    setLoading(false);

    // Redesenha a página no servidor (atualiza o contador do token)
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <Badge variant="secondary">Client-side</Badge>
        <CardTitle>Dados buscados no navegador</CardTitle>
        <CardDescription>
          Chama <code>/api/auth/me</code> com o <code>apiFetch</code>. Se o token tiver expirado, ele
          renova e repete sozinho.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button onClick={handleClick} disabled={loading}>
          {loading ? "Buscando..." : "Buscar /api/auth/me"}
        </Button>

        <RequestTimeline steps={steps} />

        {data && (
          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
