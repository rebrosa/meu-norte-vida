import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, primaryBtn } from "@/components/app/AppShell";
import { IntensityDots } from "@/components/app/IntensityDots";
import { RecordCare } from "@/components/app/RecordCare";
import { formatDateLocale } from "@/lib/dates";
import { useI18n } from "@/lib/i18n";
import { episodesQuery } from "@/lib/journal";

export const Route = createFileRoute("/_authenticated/episodios/")({
  head: () => ({
    meta: [
      { title: "Entries — Reality Check" },
      { name: "description", content: "Your personal entries." },
      { property: "og:title", content: "Entries — Reality Check" },
      { property: "og:description", content: "Your personal entries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(episodesQuery),
  component: Episodios,
});

function Episodios() {
  const { t, lang } = useI18n();
  const { data: episodes } = useSuspenseQuery(episodesQuery);
  return (
    <AppShell>
      <h1 className="font-display text-3xl text-foreground">{t("Meus registros")}</h1>
      <Link to="/episodios/novo" className={primaryBtn}>
        {t("Registrar episódio")}
      </Link>
      {episodes.length === 0 ? (
        <p className="rounded-3xl bg-secondary p-6 text-lg text-secondary-foreground">
          {t(
            "Nada registrado ainda. Quando algo acontecer, anote aqui. Isso ajuda você a lembrar com clareza depois.",
          )}
        </p>
      ) : (
        <ul className="space-y-4">
          {episodes.map((ep) => (
            <li key={ep.id} className="space-y-3 rounded-3xl bg-card p-5 ring-1 ring-border">
              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-semibold text-muted-foreground">
                  {formatDateLocale(ep.occurred_on, lang) || t("Sem data")}
                </span>
                <IntensityDots value={ep.intensity} />
              </div>
              <p className="whitespace-pre-line text-lg text-foreground">{ep.what_happened}</p>
              {ep.how_felt && (
                <p className="text-base text-muted-foreground">
                  <strong>{t("Como me senti:")}</strong> {ep.how_felt}
                </p>
              )}
              {ep.almost_did && (
                <p className="text-base text-muted-foreground">
                  <strong>{t("O que quase fiz:")}</strong> {ep.almost_did}
                </p>
              )}
              {ep.tags && ep.tags.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {ep.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                    >
                      {t(tag)}
                    </li>
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
