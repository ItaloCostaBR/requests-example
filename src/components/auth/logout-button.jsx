"use client";
// Botão de sair: pede ao servidor para apagar os cookies.
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Sair
    </Button>
  );
}
