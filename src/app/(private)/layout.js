// =============================================================
// Layout das rotas PRIVADAS (/dashboard e /cep).
//
// O proxy já barra quem não está logado, mas aqui conferimos DE
// NOVO no servidor (defesa em profundidade). Se a API disser que
// o token não vale, mandamos para o login.
// =============================================================
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AppHeader } from "@/components/layout/app-header";

export default async function PrivateLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8">
        {children}
      </main>
    </>
  );
}
