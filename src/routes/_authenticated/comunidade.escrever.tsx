import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell, fieldClass, primaryBtn, secondaryBtn } from "@/components/app/AppShell";
import { CommunityGate, StoryText } from "@/components/community/CommunityGate";
import {
  accessQuery,
  allConsented,
  type Consents,
  initialOf,
  LIMITS,
  myStoryQuery,
  saveStory,
  type StoryDraft,
  submitStory,
  THEMES,
  themeLabel,
  validateDraft,
  WARNINGS,
  warningLabel,
} from "@/lib/community";
import { PRIVACY_NOTE } from "@/lib/community-text";
import { useI18n } from "@/lib/i18n";
import { profileQuery } from "@/lib/journal";

export const Route = createFileRoute("/_authenticated/comunidade/escrever")({
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
  validateSearch: (s: Record<string, unknown>): { id: string | undefined } => ({
    id: typeof s["id"] === "string" ? s["id"] : undefined,
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(accessQuery),
  component: () => (
    <CommunityGate>
      <Escrever />
    </CommunityGate>
  ),
});

const EMPTY: StoryDraft = { title: "", body: "", theme: "", pseudonym: "", warnings: [] };

function Escrever() {
  const { t } = useI18n();
  const { user } = Route.useRouteContext();
  const { id: initialId } = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const profile = useQuery(profileQuery);
  const existing = useQuery({ ...myStoryQuery(initialId ?? ""), enabled: !!initialId });
  const [id, setId] = useState<string | null>(initialId ?? null);
  const [d, setD] = useState<StoryDraft>(EMPTY);
  const [aliasMode, setAliasMode] = useState<"alias" | "initial">("alias");
  const [step, setStep] = useState<"edit" | "preview">("edit");
  const [c, setC] = useState<Consents>({ rules: false, moderation: false, display: false });
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(!initialId);

  const realName = profile.data?.display_name ?? "";
  const initial = initialOf(realName);
  const identity = { name: realName, email: user.email ?? "" };

  useEffect(() => {
    const s = existing.data;
    if (s && !loaded) {
      setD({
        title: s.title,
        body: s.body,
        theme: s.theme,
        pseudonym: s.pseudonym,
        warnings: s.content_warnings,
      });
      setLoaded(true);
    }
  }, [existing.data, loaded]);

  useEffect(() => {
    if (loaded && initial && existing.data?.pseudonym === initial) setAliasMode("initial");
  }, [loaded, initial, existing.data]);

  const draft: StoryDraft = { ...d, pseudonym: aliasMode === "initial" ? initial : d.pseudonym };
  const set = <K extends keyof StoryDraft>(k: K, v: StoryDraft[K]) =>
    setD((p) => ({ ...p, [k]: v }));
  const err = validateDraft(draft, identity);
  const wasPublished = existing.data?.status === "published";

  async function save(): Promise<string | null> {
    if (err) {
      toast.error(t(err));
      return null;
    }
    setBusy(true);
    try {
      const newId = await saveStory(id, draft);
      setId(newId);
      await qc.invalidateQueries({ queryKey: ["community"] });
      return newId;
    } catch (e) {
      toast.error((e as Error).message);
      return null;
    } finally {
      setBusy(false);
    }
  }
  async function submit() {
    const sid = await save();
    if (!sid) return;
    setBusy(true);
    try {
      await submitStory(sid, c);
      await qc.invalidateQueries({ queryKey: ["community"] });
      toast.success(t("Enviado para a moderação."));
      navigate({ to: "/comunidade/meus" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (!loaded)
    return (
      <AppShell>
        <p className="text-lg text-muted-foreground">{t("Carregando…")}</p>
      </AppShell>
    );

  const privacy = (
    <p className="rounded-2xl bg-secondary p-4 text-base text-secondary-foreground">
      {t(PRIVACY_NOTE)}
    </p>
  );

  if (step === "preview") {
    const box = (k: keyof Consents, label: string) => (
      <label className="flex min-h-12 items-start gap-3 text-lg text-foreground">
        <input
          type="checkbox"
          checked={c[k]}
          onChange={(e) => setC({ ...c, [k]: e.target.checked })}
          className="mt-1 h-6 w-6 shrink-0"
        />
        {t(label)}
      </label>
    );
    return (
      <AppShell>
        <h1 className="font-display text-3xl text-foreground">{t("Revise antes de enviar")}</h1>
        <p className="text-base text-muted-foreground">
          {t("Este é exatamente o texto que será enviado.")}
        </p>
        <article className="space-y-2 rounded-3xl bg-card p-5 ring-1 ring-border">
          <p className="text-sm text-muted-foreground">{t(themeLabel(draft.theme))}</p>
          <h2 className="text-2xl font-semibold text-foreground">{draft.title}</h2>
          <p className="text-base text-muted-foreground">
            {t("por")} {draft.pseudonym}
          </p>
          {draft.warnings.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {t("Avisos:")} {draft.warnings.map((w) => t(warningLabel(w))).join(", ")}
            </p>
          )}
          <StoryText text={draft.body} />
        </article>
        {privacy}
        <div className="space-y-2">
          {box(
            "rules",
            "Li e aceito as regras da comunidade: respeito, sem culpar ninguém, sem dados pessoais, sem pedidos de dinheiro.",
          )}
          {box(
            "moderation",
            "Aceito que meu texto seja lido pela moderação antes de qualquer publicação.",
          )}
          {box(
            "display",
            "Se aprovado, aceito que ele seja exibido para outras usuárias com conta no app.",
          )}
        </div>
        {wasPublished && (
          <p className="text-base text-muted-foreground">
            {t("Ao enviar a edição, o relato sai do mural até ser revisado de novo.")}
          </p>
        )}
        <button disabled={!allConsented(c) || busy} onClick={submit} className={primaryBtn}>
          {t("Enviar para moderação")}
        </button>
        <button onClick={() => setStep("edit")} className={secondaryBtn}>
          {t("Voltar e editar")}
        </button>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Link to="/comunidade" className="text-primary underline">
        {t("← Comunidade")}
      </Link>
      <h1 className="font-display text-3xl text-foreground">{t("Compartilhar minha história")}</h1>
      {privacy}
      <label className="block space-y-2">
        <span className="text-lg font-semibold text-foreground">{t("Título")}</span>
        <input
          maxLength={LIMITS.title[1]}
          value={d.title}
          onChange={(e) => set("title", e.target.value)}
          className={fieldClass}
        />
      </label>
      <label className="block space-y-2">
        <span className="text-lg font-semibold text-foreground">{t("Sua história")}</span>
        <textarea
          maxLength={LIMITS.body[1]}
          rows={10}
          value={d.body}
          onChange={(e) => set("body", e.target.value)}
          className={fieldClass}
        />
        <span className="text-sm text-muted-foreground">
          {d.body.trim().length} / {LIMITS.body[1]} {t("(mínimo")} {LIMITS.body[0]})
        </span>
      </label>
      <label className="block space-y-2">
        <span className="text-lg font-semibold text-foreground">{t("Tema")}</span>
        <select
          value={d.theme}
          onChange={(e) => set("theme", e.target.value)}
          className={`${fieldClass} min-h-12`}
        >
          <option value="">{t("Escolha um tema")}</option>
          {THEMES.map((th) => (
            <option key={th.id} value={th.id}>
              {t(th.label)}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold text-foreground">
          {t("Como seu nome aparece na comunidade")}
        </legend>
        <label className="flex min-h-12 items-center gap-3 text-lg text-foreground">
          <input
            type="radio"
            name="alias-mode"
            className="h-5 w-5"
            checked={aliasMode === "alias"}
            onChange={() => setAliasMode("alias")}
          />
          {t("Usar um apelido")}
        </label>
        {aliasMode === "alias" && (
          <div className="space-y-2">
            <input
              aria-label={t("Apelido")}
              placeholder={t("Apelido")}
              maxLength={LIMITS.pseudonym[1]}
              value={d.pseudonym}
              onChange={(e) => set("pseudonym", e.target.value)}
              className={fieldClass}
            />
            <p className="text-sm text-muted-foreground">
              {t(
                "Escolha um apelido que não revele seu nome, e-mail, cidade ou qualquer detalhe que identifique você.",
              )}
            </p>
          </div>
        )}
        <label className="flex min-h-12 items-center gap-3 text-lg text-foreground">
          <input
            type="radio"
            name="alias-mode"
            className="h-5 w-5"
            disabled={!initial}
            checked={aliasMode === "initial"}
            onChange={() => setAliasMode("initial")}
          />
          {t("Usar só a inicial do meu nome")}
        </label>
        {!initial && (
          <p className="text-sm text-muted-foreground">
            {t("Para usar a inicial, preencha seu nome na tela Conta.")}
          </p>
        )}
        <p role="status" className="text-base text-foreground">
          {t("Assim vai aparecer:")}{" "}
          <strong>
            {t("por")} {draft.pseudonym || "…"}
          </strong>
        </p>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-lg font-semibold text-foreground">
          {t("Avisos de conteúdo (opcional)")}
        </legend>
        {WARNINGS.map((w) => (
          <label key={w.id} className="flex min-h-12 items-center gap-3 text-lg text-foreground">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={d.warnings.includes(w.id)}
              onChange={(e) =>
                set(
                  "warnings",
                  e.target.checked ? [...d.warnings, w.id] : d.warnings.filter((x) => x !== w.id),
                )
              }
            />
            {t(w.label)}
          </label>
        ))}
      </fieldset>
      {err && <p className="text-base text-muted-foreground">{t(err)}</p>}
      <button disabled={!!err || busy} onClick={() => setStep("preview")} className={primaryBtn}>
        {t("Revisar antes de enviar")}
      </button>
      <button
        disabled={!!err || busy}
        onClick={async () => {
          if (await save())
            toast.success(
              wasPublished
                ? t("Salvo. O relato saiu do mural até nova revisão.")
                : t("Rascunho salvo."),
            );
        }}
        className={secondaryBtn}
      >
        {t("Salvar rascunho")}
      </button>
    </AppShell>
  );
}
