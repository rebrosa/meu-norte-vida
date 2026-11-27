import { createFileRoute, Link } from "@tanstack/react-router";
import { LanguageSwitcher } from "@/components/app/LanguageSwitcher";
import { primaryBtn } from "@/components/app/AppShell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/seguranca")({
  head: () => ({
    meta: [
      { title: "Welcome — Reality Check" },
      { name: "description", content: "A moment before getting started." },
      { property: "og:title", content: "Welcome — Reality Check" },
      { property: "og:description", content: "A moment before getting started." },
    ],
  }),
  component: Seguranca,
});

function Seguranca() {
  const { t } = useI18n();
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 px-5 py-10">
      <LanguageSwitcher />
      <h1 className="font-display text-4xl leading-tight text-foreground">
        {t("Você está em perigo agora?")}
      </h1>
      <div className="space-y-4">
        <Link
          to="/ajuda"
          className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-accent px-6 text-lg font-semibold text-accent-foreground"
        >
          {t("Sim, preciso de ajuda")}
        </Link>
        <Link to="/inicio" className={primaryBtn}>
          {t("Não, estou em segurança")}
        </Link>
      </div>
    </main>
  );
}
