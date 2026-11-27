import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app/AppShell";
import { useI18n, type Lang } from "@/lib/i18n";
import { accessQuery } from "@/lib/community";

export function CommunityGate({
  children,
  moderatorOnly = false,
}: {
  children: ReactNode;
  moderatorOnly?: boolean;
}) {
  const { t } = useI18n();
  const { data } = useSuspenseQuery(accessQuery);
  const ok = moderatorOnly ? data.moderator : data.enabled;
  if (!ok) {
    return (
      <AppShell>
        <h1 className="font-display text-3xl text-foreground">{t("Ainda não disponível")}</h1>
        <p className="text-lg text-muted-foreground">
          {moderatorOnly
            ? t("Esta área é só para a moderação.")
            : t("Este espaço ainda está em preparação e será aberto com cuidado.")}
        </p>
        <Link to="/inicio" className="text-lg text-primary underline">
          {t("Voltar ao início")}
        </Link>
      </AppShell>
    );
  }
  return <>{children}</>;
}

const NOTICE: Record<Lang, string> = {
  "pt-BR":
    "A comunidade não é um serviço de emergência. Se você estiver em perigo, ligue 190 ou 180, ou abra",
  en: "The community is not an emergency service. If you are in danger, call your local emergency number (112 in Europe, 110 in Germany), or open",
  de: "Die Gemeinschaft ist kein Notdienst. Wenn du in Gefahr bist, ruf die örtliche Notrufnummer an (112 in Europa, 110 in Deutschland) oder öffne",
};

export function CommunityNotice() {
  const { t, lang } = useI18n();
  return (
    <p className="rounded-2xl bg-secondary p-4 text-base text-secondary-foreground">
      {NOTICE[lang]}{" "}
      <Link to="/ajuda" className="underline">
        {t("Preciso de ajuda")}
      </Link>
      .
    </p>
  );
}

export function StoryText({ text }: { text: string }) {
  // Rendered as plain text only — never as HTML.
  return (
    <div className="whitespace-pre-wrap break-words text-lg leading-relaxed text-foreground">
      {text}
    </div>
  );
}
