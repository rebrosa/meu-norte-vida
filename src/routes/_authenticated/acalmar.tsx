import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { suggestGrounding } from "@/lib/grounding.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/acalmar")({
  head: () => ({
    meta: [
      { title: "Respirar — Reality Check" },
      { name: "description", content: "Um momento para respirar e se reconectar com o presente." },
      { property: "og:title", content: "Respirar — Reality Check" },
      { property: "og:description", content: "Um momento para respirar e se reconectar com o presente." },
    ],
  }),
  component: Acalmar,
});

function Acalmar() {
  const run = useServerFn(suggestGrounding);
  const navigate = useNavigate();
  const [feeling, setFeeling] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setText(null);
    try {
      const res = await run({ data: { feeling } });
      if (res.error) setError(res.error);
      else setText(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado.");
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-5 py-8">
      <header className="flex items-center justify-between">
        <span className="font-display text-xl text-primary">Reality Check</span>
        <button onClick={signOut} className="min-h-12 px-3 text-sm text-muted-foreground underline">
          Sair
        </button>
      </header>

      <section className="space-y-2">
        <h1 className="font-display text-3xl text-foreground">Como você está agora?</h1>
        <p className="text-lg text-muted-foreground">
          Descreva o que está sentindo. Vou sugerir um exercício curto para trazer você de volta ao presente.
        </p>
      </section>

      <form onSubmit={submit} className="space-y-4">
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="Ex.: estou ansiosa, com o coração acelerado e pensando muito…"
          className="w-full rounded-2xl border border-border bg-card p-4 text-lg text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={loading || feeling.trim().length < 3}
          className="min-h-12 w-full rounded-2xl bg-primary px-6 py-3 text-lg font-medium text-primary-foreground transition-opacity disabled:opacity-50"
        >
          {loading ? "Preparando seu exercício…" : "Sugerir um exercício"}
        </button>
      </form>

      {error && (
        <p role="alert" className="rounded-2xl bg-destructive/10 p-4 text-destructive">
          {error}
        </p>
      )}

      {text && (
        <article className="whitespace-pre-line rounded-3xl bg-secondary p-6 text-lg leading-relaxed text-secondary-foreground">
          {text}
        </article>
      )}

      <p className="mt-auto text-center text-sm text-muted-foreground">
        Em perigo? Alemanha 110 · Brasil 190 · Ligue 180
      </p>
    </main>
  );
}
