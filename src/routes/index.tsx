import { createFileRoute, Link } from "@tanstack/react-router";
import { LanguageSwitcher } from "@/components/app/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reality Check" },
      { name: "description", content: "A personal, private journal." },
      { property: "og:title", content: "Reality Check" },
      { property: "og:description", content: "A personal, private journal." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-5 text-center">
      <div className="w-full">
        <LanguageSwitcher />
      </div>
      <h1 className="font-display text-5xl text-primary">Reality Check</h1>
      <p className="text-lg text-muted-foreground">{t("Um espaço calmo e privado, só seu.")}</p>
      <Link
        to="/seguranca"
        className="inline-flex min-h-12 items-center rounded-2xl bg-primary px-8 text-lg font-medium text-primary-foreground"
      >
        {t("Começar")}
      </Link>
    </main>
  );
}
