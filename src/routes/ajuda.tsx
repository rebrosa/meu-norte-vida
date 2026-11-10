import { createFileRoute, Link } from "@tanstack/react-router";
import { CrisisContacts } from "@/components/app/CrisisContacts";

export const Route = createFileRoute("/ajuda")({
  head: () => ({
    meta: [
      { title: "Contatos — Reality Check" },
      { name: "description", content: "Números de contato úteis." },
      { property: "og:title", content: "Contatos — Reality Check" },
      { property: "og:description", content: "Números de contato úteis." },
    ],
  }),
  component: Ajuda,
});

function Ajuda() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-5 py-8">
      <header className="space-y-3">
        <h1 className="font-display text-3xl text-foreground">Você não está sozinha.</h1>
        <p className="text-lg text-muted-foreground">
          Se estiver em perigo, ligue agora. Toque no número para chamar. Se puder, vá para um lugar seguro.
        </p>
      </header>
      <CrisisContacts />
      <Link
        to="/inicio"
        className="mt-auto inline-flex min-h-12 items-center justify-center rounded-2xl bg-secondary px-6 text-lg font-semibold text-secondary-foreground"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
