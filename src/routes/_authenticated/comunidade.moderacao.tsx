import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, fieldClass } from "@/components/app/AppShell";
import { CommunityGate, StoryText } from "@/components/community/CommunityGate";
import { useI18n, type Lang } from "@/lib/i18n";
import {
  accessQuery,
  moderate,
  pendingQuery,
  REPORT_REASONS,
  reportsQuery,
  reviewReport,
  STATUS_LABEL,
  themeLabel,
  warningLabel,
} from "@/lib/community";

export const Route = createFileRoute("/_authenticated/comunidade/moderacao")({
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
  loader: async ({ context }) => {
    const a = await context.queryClient.ensureQueryData(accessQuery);
    if (a.moderator)
      await Promise.all([
        context.queryClient.ensureQueryData(pendingQuery),
        context.queryClient.ensureQueryData(reportsQuery),
      ]);
  },
  component: () => (
    <CommunityGate moderatorOnly>
      <Moderacao />
    </CommunityGate>
  ),
});

const ALIAS_REMINDER: Record<Lang, string> = {
  "pt-BR":
    "Confira se o apelido não revela a identidade da autora (nome, sobrenome, e-mail, cidade). Na dúvida, peça correção.",
  en: "Check that the nickname does not reveal the author's identity (name, surname, email, city). If in doubt, request changes.",
  de: "Prüfe, ob der Spitzname die Identität der Autorin verrät (Name, Nachname, E-Mail, Stadt). Fordere im Zweifel eine Korrektur an.",
};

function Moderacao() {
  const { t, lang } = useI18n();
  const qc = useQueryClient();
  const { data: stories } = useSuspenseQuery(pendingQuery);
  const { data: reports } = useSuspenseQuery(reportsQuery);
  const [notes, setNotes] = useState<Record<string, string>>({});
  async function run(fn: () => Promise<void>, ok: string) {
    try {
      await fn();
      toast.success(ok);
      await qc.invalidateQueries({ queryKey: ["community"] });
    } catch (e) {
      toast.error((e as Error).message);
    }
  }
  const note = (id: string) => notes[id] ?? "";
  const btn = "min-h-12 rounded-2xl bg-card px-4 text-base text-foreground ring-1 ring-border";
  return (
    <AppShell>
      <Link to="/comunidade" className="text-primary underline">
        {t("← Comunidade")}
      </Link>
      <h1 className="font-display text-3xl text-foreground">{t("Moderação")}</h1>
      <p className="text-base text-muted-foreground">
        {t("Não reescreva relatos. Se algo precisar mudar, peça correção à autora.")}
      </p>
      <p className="rounded-2xl bg-secondary p-4 text-base text-secondary-foreground">
        {ALIAS_REMINDER[lang]}
      </p>
      <h2 className="text-xl font-semibold text-foreground">
        {t("Relatos (")}
        {stories.length})
      </h2>
      {stories.length === 0 && <p className="text-muted-foreground">{t("Nada para revisar.")}</p>}
      {stories.map((s) => (
        <article key={s.id} className="space-y-3 rounded-3xl bg-card p-5 ring-1 ring-border">
          <p className="text-sm font-semibold text-primary">
            {t(STATUS_LABEL[s.status] ?? s.status)} · {t(themeLabel(s.theme))}
          </p>
          <h3 className="text-xl font-semibold text-foreground">{s.title}</h3>
          <p className="text-muted-foreground">
            {t("por")} {s.pseudonym}
            {s.content_warnings.length
              ? ` · ${t("Avisos:")} ${s.content_warnings.map((w) => t(warningLabel(w))).join(", ")}`
              : ""}
          </p>
          <StoryText text={s.body} />
          <textarea
            rows={2}
            maxLength={1000}
            placeholder={t("Motivo / mensagem para a autora")}
            aria-label={t("Motivo / mensagem para a autora")}
            value={note(s.id)}
            onChange={(e) => setNotes({ ...notes, [s.id]: e.target.value })}
            className={fieldClass}
          />
          <div className="flex flex-wrap gap-2">
            {s.status === "pending" && (
              <>
                <button
                  className={btn}
                  onClick={() => run(() => moderate(s.id, "approve", note(s.id)), t("Aprovado."))}
                >
                  {t("Aprovar")}
                </button>
                <button
                  className={btn}
                  onClick={() =>
                    run(() => moderate(s.id, "request_changes", note(s.id)), t("Correção pedida."))
                  }
                >
                  {t("Pedir correção")}
                </button>
                <button
                  className={btn}
                  onClick={() =>
                    run(() => moderate(s.id, "reject", note(s.id)), t("Não aprovado."))
                  }
                >
                  {t("Não aprovar")}
                </button>
              </>
            )}
            {s.status === "published" && (
              <button
                className={btn}
                onClick={() =>
                  run(() => moderate(s.id, "withdraw", note(s.id)), t("Retirado do mural."))
                }
              >
                {t("Retirar do mural")}
              </button>
            )}
          </div>
        </article>
      ))}
      <h2 className="text-xl font-semibold text-foreground">
        {t("Denúncias abertas (")}
        {reports.length})
      </h2>
      {reports.length === 0 && (
        <p className="text-muted-foreground">{t("Nenhuma denúncia aberta.")}</p>
      )}
      {reports.map((r) => (
        <article key={r.id} className="space-y-3 rounded-3xl bg-card p-5 ring-1 ring-border">
          <p className="font-semibold text-foreground">
            {t(REPORT_REASONS.find((x) => x.id === r.reason)?.label ?? r.reason)}
          </p>
          {r.details && <StoryText text={r.details} />}
          <Link
            to="/comunidade/relato/$id"
            params={{ id: r.story_id }}
            className="text-primary underline"
          >
            {t("Abrir relato")}
          </Link>
          <textarea
            rows={2}
            maxLength={1000}
            placeholder={t("Ação tomada")}
            aria-label={t("Ação tomada")}
            value={note(r.id)}
            onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })}
            className={fieldClass}
          />
          <button
            className={btn}
            onClick={() =>
              run(() => reviewReport(r.id, note(r.id)), t("Denúncia examinada."))
            }
          >
            {t("Marcar como examinada")}
          </button>
        </article>
      ))}
    </AppShell>
  );
}
