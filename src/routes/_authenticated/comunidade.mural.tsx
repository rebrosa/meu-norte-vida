import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { CommunityGate, CommunityNotice } from "@/components/community/CommunityGate";
import { useI18n } from "@/lib/i18n";
import {
  accessQuery,
  isTheme,
  muralQuery,
  THEMES,
  themeLabel,
  warningLabel,
} from "@/lib/community";

type S = { page: number; tema: string | undefined };
export const Route = createFileRoute("/_authenticated/comunidade/mural")({
  head: () => ({
    meta: [
      { title: "Community — Reality Check" },
      { name: "description", content: "A space for reading and sharing." },
      { property: "og:title", content: "Community — Reality Check" },
      { property: "og:description", content: "A space for reading and sharing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): S => ({
    page: Math.max(1, Math.floor(Number(s["page"])) || 1),
    tema: isTheme(s["tema"]) ? s["tema"] : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const a = await context.queryClient.ensureQueryData(accessQuery);
    if (a.enabled) await context.queryClient.ensureQueryData(muralQuery(deps.page, deps.tema));
  },
  component: () => (
    <CommunityGate>
      <Mural />
    </CommunityGate>
  ),
});

function Mural() {
  const { t } = useI18n();
  const { page, tema } = Route.useSearch();
  const { data } = useSuspenseQuery(muralQuery(page, tema));
  const chip = (on: boolean) =>
    `min-h-12 rounded-2xl px-4 py-2 text-base ${on ? "bg-primary text-primary-foreground" : "bg-card ring-1 ring-border text-foreground"}`;
  return (
    <AppShell>
      <Link to="/comunidade" className="text-primary underline">
        {t("← Comunidade")}
      </Link>
      <h1 className="font-display text-3xl text-foreground">{t("Histórias")}</h1>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("Filtrar por tema")}>
        <Link to="/comunidade/mural" search={{ page: 1, tema: undefined }} className={chip(!tema)}>
          {t("Todos")}
        </Link>
        {THEMES.map((th) => (
          <Link
            key={th.id}
            to="/comunidade/mural"
            search={{ page: 1, tema: th.id }}
            className={chip(tema === th.id)}
          >
            {t(th.label)}
          </Link>
        ))}
      </div>
      {data.stories.length === 0 && (
        <p className="text-lg text-muted-foreground">{t("Ainda não há histórias aqui.")}</p>
      )}
      <ul className="space-y-4">
        {data.stories.map((s) => (
          <li key={s.story_id}>
            <Link
              to="/comunidade/relato/$id"
              params={{ id: s.story_id }}
              className="block space-y-2 rounded-3xl bg-card p-5 ring-1 ring-border"
            >
              <p className="text-sm text-muted-foreground">{t(themeLabel(s.theme))}</p>
              <h2 className="text-xl font-semibold text-foreground">{s.title}</h2>
              <p className="text-base text-muted-foreground">
                {t("por")} {s.pseudonym}
              </p>
              {s.content_warnings.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {t("Avisos:")} {s.content_warnings.map((w) => t(warningLabel(w))).join(", ")}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <nav className="flex justify-between" aria-label={t("Páginas")}>
        {page > 1 ? (
          <Link
            to="/comunidade/mural"
            search={{ page: page - 1, tema }}
            className="min-h-12 p-3 text-primary underline"
          >
            {t("← Anteriores")}
          </Link>
        ) : (
          <span />
        )}
        {data.hasNext && (
          <Link
            to="/comunidade/mural"
            search={{ page: page + 1, tema }}
            className="min-h-12 p-3 text-primary underline"
          >
            {t("Próximas →")}
          </Link>
        )}
      </nav>
      <CommunityNotice />
    </AppShell>
  );
}
