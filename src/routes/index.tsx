import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reality Check" },
      { name: "description", content: "Um diário pessoal e privado." },
      { property: "og:title", content: "Reality Check" },
      { property: "og:description", content: "Um diário pessoal e privado." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-5 text-center">
      <h1 className="font-display text-5xl text-primary">Reality Check</h1>
      <p className="text-lg text-muted-foreground">Um espaço calmo e privado, só seu.</p>
      <Link to="/seguranca" className="inline-flex min-h-12 items-center rounded-2xl bg-primary px-8 text-lg font-medium text-primary-foreground">
        Começar
      </Link>
    </main>
  );
}
