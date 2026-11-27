import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { suggestGrounding } from "@/lib/grounding.functions";
import { AppShell } from "@/components/app/AppShell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/acalmar")({
  head: () => ({
    meta: [
      { title: "Breathe — Reality Check" },
      { name: "description", content: "A moment to breathe and reconnect with the present." },
      { property: "og:title", content: "Breathe — Reality Check" },
      {
        property: "og:description",
        content: "A moment to breathe and reconnect with the present.",
      },
    ],
  }),
  component: Acalmar,
});

function Acalmar() {
  const { t, lang } = useI18n();
  const run = useServerFn(suggestGrounding);
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
      const res = await run({ data: { feeling, lang } });
      if (res.error) setError(res.error);
      else setText(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("Algo deu errado."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <section className="space-y-2">
        <h1 className="font-display text-3xl text-foreground">{t("Como você está agora?")}</h1>
        <p className="text-lg text-muted-foreground">
          {t(
            "Descreva o que está sentindo. Vou sugerir um exercício curto para trazer você de volta ao presente.",
          )}
        </p>
      </section>

      <form onSubmit={submit} className="space-y-4">
        <textarea
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder={t("Ex.: estou ansiosa, com o coração acelerado e pensando muito…")}
          aria-label={t("Como você está agora?")}
          className="w-full rounded-2xl border border-border bg-card p-4 text-lg text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={loading || feeling.trim().length < 3}
          className="min-h-12 w-full rounded-2xl bg-primary px-6 py-3 text-lg font-medium text-primary-foreground transition-opacity disabled:opacity-50"
        >
          {loading ? t("Preparando seu exercício…") : t("Sugerir um exercício")}
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

      <Link
        to="/ajuda"
        className="mx-auto mt-auto inline-flex min-h-12 items-center px-4 text-base text-muted-foreground underline"
      >
        {t("Preciso de ajuda")}
      </Link>
    </AppShell>
  );
}
