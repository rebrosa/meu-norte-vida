import { ExternalLink } from "lucide-react";
import { secondaryBtn } from "@/components/app/AppShell";
import { useI18n } from "@/lib/i18n";
import { FEEDBACK_BODY } from "@/lib/translations.extra";

const FEEDBACK_URL = "https://tally.so/r/Kp1LYD";

export function FeedbackLink() {
  const { t } = useI18n();
  return (
    <section
      aria-labelledby="feedback-heading"
      className="space-y-4 rounded-2xl bg-card p-4 ring-1 ring-border"
    >
      <h2 id="feedback-heading" className="font-display text-2xl text-foreground">
        {t("Sua opinião importa")}
      </h2>
      <p className="text-base text-muted-foreground">{t(FEEDBACK_BODY)}</p>
      <p className="text-base text-muted-foreground">
        {t("Não inclua nomes, contatos ou trechos do seu diário.")}
      </p>
      <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer" className={secondaryBtn}>
        {t("Enviar feedback")}
        <ExternalLink className="ml-2 h-5 w-5" aria-hidden />
        <span className="sr-only"> {t("(abre em uma nova aba)")}</span>
      </a>
    </section>
  );
}
