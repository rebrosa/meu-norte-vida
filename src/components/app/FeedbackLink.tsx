import { ExternalLink } from "lucide-react";
import { secondaryBtn } from "@/components/app/AppShell";

const FEEDBACK_URL = "https://tally.so/r/Kp1LYD";

export function FeedbackLink() {
  return (
    <section
      aria-labelledby="feedback-heading"
      className="space-y-4 rounded-2xl bg-card p-4 ring-1 ring-border"
    >
      <h2 id="feedback-heading" className="font-display text-2xl text-foreground">
        Sua opinião importa
      </h2>
      <p className="text-base text-muted-foreground">
        Queremos saber o que te ajuda, o que te atrapalha e o que falta. O formulário abre em outro
        site e está em inglês, mas você pode escrever sua resposta em português.
      </p>
      <p className="text-base text-muted-foreground">
        Não inclua nomes, contatos ou trechos do seu diário.
      </p>
      <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer" className={secondaryBtn}>
        Enviar feedback
        <ExternalLink className="ml-2 h-5 w-5" aria-hidden />
        <span className="sr-only"> (abre em uma nova aba)</span>
      </a>
    </section>
  );
}
