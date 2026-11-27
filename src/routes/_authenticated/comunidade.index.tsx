import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, primaryBtn, secondaryBtn } from "@/components/app/AppShell";
import { CommunityGate, CommunityNotice } from "@/components/community/CommunityGate";
import { useI18n } from "@/lib/i18n";
import { accessQuery } from "@/lib/community";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/comunidade/")({
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
  loader: ({ context }) => context.queryClient.ensureQueryData(accessQuery),
  component: () => (
    <CommunityGate>
      <Entrada />
    </CommunityGate>
  ),
});

function Entrada() {
  const { t } = useI18n();
  const { data } = useSuspenseQuery(accessQuery);
  return (
    <AppShell>
      <h1 className="font-display text-4xl text-foreground">{t("Você não está sozinha")}</h1>
      <p className="text-lg text-muted-foreground">
        {t("Histórias de outras mulheres, no tempo em que você quiser ler.")}
      </p>
      <Link to="/comunidade/mural" search={{ page: 1, tema: undefined }} className={primaryBtn}>
        {t("Ler histórias")}
      </Link>
      <Link to="/comunidade/escrever" search={{ id: undefined }} className={secondaryBtn}>
        {t("Compartilhar minha história")}
      </Link>
      <Link to="/comunidade/meus" className="text-lg text-primary underline">
        {t("Meus relatos")}
      </Link>
      {data.moderator && (
        <Link to="/comunidade/moderacao" className="text-lg text-primary underline">
          {t("Painel de moderação")}
        </Link>
      )}
      <CommunityNotice />
    </AppShell>
  );
}
