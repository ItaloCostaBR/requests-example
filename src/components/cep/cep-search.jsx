"use client";
// =============================================================
// Busca de CEP (CLIENT Component = roda no navegador).
//
// Cuidados no FRONT:
//   - máscara 00000-000 enquanto digita
//   - botão desabilitado se o CEP não tiver 8 números
//   - mostra "Buscando...", erro ou resultado
//
// Cuidados no BACK (src/app/api/cep/[cep]/route.js):
//   - exige login, valida o CEP de novo, chama a BrasilAPI, trata erros
//
// Token expirado? O apiFetch renova e REPETE a busca sozinho.
// A "linha do tempo" na tela mostra cada passo.
// =============================================================
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { isValidCep, maskCep, onlyDigits } from "@/lib/cep/cep-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RequestTimeline } from "@/components/shared/request-timeline";
import { CepResult } from "./cep-result";

// Botões de exemplo para testar cada cenário em aula
const examples = [
  { cep: "01001-000", label: "Praça da Sé (SP)" },
  { cep: "20040-002", label: "Centro (RJ)" },
  { cep: "12345-678", label: "Não existe (404)" },
];

export function CepSearch() {
  const router = useRouter();

  // Estados da tela
  const [cep, setCep] = useState(""); // o que está digitado
  const [address, setAddress] = useState(null); // resultado da busca
  const [error, setError] = useState(""); // mensagem de erro
  const [loading, setLoading] = useState(false); // está buscando?
  const [steps, setSteps] = useState([]); // passos do apiFetch

  // Adiciona um passo no fim da lista da linha do tempo
  function addStep(step) {
    setSteps((oldSteps) => [...oldSteps, step]);
  }

  async function search(cepValue) {
    // Limpa a busca anterior
    setError("");
    setAddress(null);
    setSteps([]);
    setLoading(true);

    try {
      const url = `/api/cep/${onlyDigits(cepValue)}`;
      const response = await apiFetch(url, {}, addStep);
      const data = await response.json();

      if (response.ok) {
        setAddress(data);
      } else {
        // O backend já manda uma mensagem pronta para o usuário
        setError(data.message);
      }
    } catch {
      setError("Não foi possível conectar ao servidor.");
    }

    setLoading(false);

    // Pede para o servidor redesenhar a página. Assim o contador
    // do token é atualizado se o apiFetch tiver renovado o token.
    router.refresh();
  }

  function handleSubmit(event) {
    event.preventDefault(); // não deixa o form recarregar a página
    search(cep);
  }

  function handleExampleClick(exampleCep) {
    setCep(exampleCep);
    search(exampleCep);
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Label htmlFor="cep">CEP</Label>
          <div className="flex gap-2">
            <Input
              id="cep"
              inputMode="numeric"
              placeholder="00000-000"
              value={cep}
              onChange={(event) => setCep(maskCep(event.target.value))}
            />
            <Button type="submit" disabled={!isValidCep(cep) || loading}>
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Testar:</span>
          {examples.map((example) => (
            <Button
              key={example.cep}
              variant="outline"
              size="sm"
              onClick={() => handleExampleClick(example.cep)}
            >
              {example.label}
            </Button>
          ))}
        </div>

        <RequestTimeline steps={steps} />

        {error && <p className="text-sm text-destructive">{error}</p>}
        {address && <CepResult address={address} />}
      </CardContent>
    </Card>
  );
}
