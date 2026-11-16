import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, primaryBtn } from "@/components/app/AppShell";
import { IntensityDots } from "@/components/app/IntensityDots";
import { RecordCare } from "@/components/app/RecordCare";
import { formatDateBR } from "@/lib/dates";
import { episodesQuery } from "@/lib/journal";

export const Route = createFileRoute("/_authenticated/episodios/")({
  head: () => ({
    meta: [
      { title: "Registros — Reality Check" },
      { name: "description", content: "Seus registros pessoais." },
      { property: "og:title", content: "Registros — Reality Check" },
      { property: "og:description", content: "Seus registros pessoais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(episodesQuery),
  component: Episodios,
});

function Episodios() {
  const { data: episodes } = useSuspenseQuery(episodesQuery);
  return (
    <AppShell>
      <h1 className="font-display text-3xl text-foreground">Meus registros</h1>
      <Link to="/episodios/novo" className={primaryBtn}>
        Registrar episódio
      </Link>
      {episodes.length === 0 ? (
        <p className="rounded-3xl bg-secondary p-6 text-lg text-secondary-foreground">
          Nada registrado ainda. Quando algo acontecer, anote aqui. Isso ajuda você a lembrar com clareza depois.
        </p>
      ) : (
        <ul className="space-y-4">
          {episodes.map((ep) => (
            <li key={ep.id} className="space-y-3 rounded-3xl bg-card p-5 ring-1 ring-border">
              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-semibold text-muted-foreground">{formatDateBR(ep.occurred_on) || "Sem data"}</span>
                <IntensityDots value={ep.intensity} />
              </div>
              <p className="whitespace-pre-line text-lg text-foreground">{ep.what_happened}</p>
              {ep.how_felt && <p className="text-base text-muted-foreground"><strong>Como me senti:</strong> {ep.how_felt}</p>}
              {ep.almost_did && <p className="text-base text-muted-foreground"><strong>O que quase fiz:</strong> {ep.almost_did}</p>}
              {ep.tags && ep.tags.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {ep.tags.map((t) => (
                    <li key={t} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">{t}</li>
                  ))}
                </ul>
              )}
              <RecordCare />
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
