import { Link } from "@tanstack/react-router";
import { BookOpen, Feather, Home, User, Wind } from "lucide-react";
import type { ReactNode } from "react";

const TABS = [
  { to: "/inicio", label: "Início", Icon: Home },
  { to: "/episodios", label: "Registros", Icon: BookOpen },
  { to: "/decisao", label: "Decisão", Icon: Feather },
  { to: "/acalmar", label: "Respirar", Icon: Wind },
  { to: "/conta", label: "Conta", Icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      <main className="flex flex-1 flex-col gap-6 px-5 pb-32 pt-8">{children}</main>
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      >
        <ul className="mx-auto flex max-w-md justify-between px-2">
          {TABS.map(({ to, label, Icon }) => (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold text-muted-foreground"
                activeProps={{ className: "text-primary", "aria-current": "page" }}
              >
                <Icon className="h-6 w-6" aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export const fieldClass =
  "w-full rounded-2xl border border-border bg-card p-4 text-lg text-foreground outline-none focus:ring-2 focus:ring-ring";
export const primaryBtn =
  "inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground transition-opacity disabled:opacity-50";
export const secondaryBtn =
  "inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-secondary px-6 py-3 text-lg font-semibold text-secondary-foreground transition-opacity disabled:opacity-50";
