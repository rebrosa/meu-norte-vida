import { createFileRoute, Link } from "@tanstack/react-router";
import { CrisisContacts } from "@/components/app/CrisisContacts";
import { LanguageSwitcher } from "@/components/app/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/ajuda")({
  head: () => ({
    meta: [
      { title: "Contacts — Reality Check" },
      { name: "description", content: "Useful contact numbers." },
      { property: "og:title", content: "Contacts — Reality Check" },
      { property: "og:description", content: "Useful contact numbers." },
    ],
  }),
  component: Ajuda,
});

function Ajuda() {
  const { t } = useI18n();
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-5 py-8">
      <LanguageSwitcher />
      <header className="space-y-3">
        <h1 className="font-display text-3xl text-foreground">{t("Você não está sozinha.")}</h1>
        <p className="text-lg text-muted-foreground">
          {t(
            "Se estiver em perigo, ligue agora. Toque no número para chamar. Se puder, vá para um lugar seguro.",
          )}
        </p>
      </header>
      <CrisisContacts />
      <Link
        to="/inicio"
        className="mt-auto inline-flex min-h-12 items-center justify-center rounded-2xl bg-secondary px-6 text-lg font-semibold text-secondary-foreground"
      >
        {t("Voltar ao início")}
      </Link>
    </main>
  );
}
