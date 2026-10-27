"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm({ redirectTo }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true)
    const formData = {
      email,
      password,
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log("Resposta do login:", response);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Falha no login.");
        setLoading(false);
        return;
      }

      // Login bem-sucedido: redireciona para a página desejada
      window.location.href = redirectTo || "/dashboard";
    } catch (err) {
      console.error("Erro ao fazer login:", err);
    } finally {
      setLoading(false);
    }

}

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>
          Use <code>estagiario@bootcamp.com</code> ou <code>admin@bootcamp.com</code> com a senha{" "}
          <code>123456</code>.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>

        <CardFooter className="mt-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
