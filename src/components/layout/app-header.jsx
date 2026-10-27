// Cabeçalho das rotas privadas (Server Component: sem "use client").
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/auth/logout-button";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/cep", label: "CEP" },
];

export function AppHeader({ user }) {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="font-bold">
            🚀 Bootcamp
          </Link>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          <span>{user.name}</span>
          <Badge variant="secondary">{user.role}</Badge>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
