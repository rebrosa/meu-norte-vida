import { createFileRoute, Link } from "@tanstack/react-router";
import { primaryBtn } from "@/components/app/AppShell";

export const Route = createFileRoute("/_authenticated/seguranca")({
  head: () => ({
    meta: [
      { title: "Bem-vinda — Reality Check" },
      { name: "description", content: "Um momento antes de começar." },
      { property: "og:title", content: "Bem-vinda — Reality Check" },
      { property: "og:description", content: "Um momento antes de começar." },
    ],
  }),
  component: Seguranca,
});

function Seguranca() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 px-5 py-10">
      <h1 className="font-display text-4xl leading-tight text-foreground">Você está em perigo agora?</h1>
      <div className="space-y-4">
        <Link
          to="/ajuda"
          className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-accent px-6 text-lg font-semibold text-accent-foreground"
        >
          Sim, preciso de ajuda
        </Link>
        <Link to="/inicio" className={primaryBtn}>
          Não, estou em segurança
        </Link>
      </div>
    </main>
  );
}
