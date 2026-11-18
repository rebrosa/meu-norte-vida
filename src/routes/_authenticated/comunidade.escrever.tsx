import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell, fieldClass, primaryBtn, secondaryBtn } from "@/components/app/AppShell";
import { CommunityGate, StoryText } from "@/components/community/CommunityGate";
import { accessQuery, allConsented, type Consents, LIMITS, myStoryQuery, saveStory, type StoryDraft, submitStory, THEMES, themeLabel, validateDraft, WARNINGS, warningLabel } from "@/lib/community";

export const Route = createFileRoute("/_authenticated/comunidade/escrever")({
  head: () => ({ meta: [{ title: "Comunidade — Reality Check" }, { name: "description", content: "Espaço de leitura e partilha." }, { property: "og:title", content: "Comunidade — Reality Check" }, { property: "og:description", content: "Espaço de leitura e partilha." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  validateSearch: (s: Record<string, unknown>): { id: string | undefined } => ({ id: typeof s["id"] === "string" ? s["id"] : undefined }),
  loader: ({ context }) => context.queryClient.ensureQueryData(accessQuery),
  component: () => <CommunityGate><Escrever /></CommunityGate>,
});

const EMPTY: StoryDraft = { title: "", body: "", theme: "", pseudonym: "", warnings: [] };

function Escrever() {
  const { id: initialId } = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const existing = useQuery({ ...myStoryQuery(initialId ?? ""), enabled: !!initialId });
  const [id, setId] = useState<string | null>(initialId ?? null);
  const [d, setD] = useState<StoryDraft>(EMPTY);
  const [step, setStep] = useState<"edit" | "preview">("edit");
  const [c, setC] = useState<Consents>({ rules: false, moderation: false, display: false });
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(!initialId);

  useEffect(() => {
    const s = existing.data;
    if (s && !loaded) { setD({ title: s.title, body: s.body, theme: s.theme, pseudonym: s.pseudonym, warnings: s.content_warnings }); setLoaded(true); }
  }, [existing.data, loaded]);

  const set = <K extends keyof StoryDraft>(k: K, v: StoryDraft[K]) => setD((p) => ({ ...p, [k]: v }));
  const err = validateDraft(d);
  const wasPublished = existing.data?.status === "published";

  async function save(): Promise<string | null> {
    if (err) { toast.error(err); return null; }
    setBusy(true);
    try { const newId = await saveStory(id, d); setId(newId); await qc.invalidateQueries({ queryKey: ["community"] }); return newId; }
    catch (e) { toast.error((e as Error).message); return null; } finally { setBusy(false); }
  }
  async function submit() {
    const sid = await save(); if (!sid) return;
    setBusy(true);
    try { await submitStory(sid, c); await qc.invalidateQueries({ queryKey: ["community"] }); toast.success("Enviado para a moderação."); navigate({ to: "/comunidade/meus" }); }
    catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  }

  if (!loaded) return <AppShell><p className="text-lg text-muted-foreground">Carregando…</p></AppShell>;

  const privacy = <p className="rounded-2xl bg-secondary p-4 text-base text-secondary-foreground">Evite nomes reais, endereços, contatos e detalhes que identifiquem você, seus filhos ou outras pessoas. Usar um pseudônimo não garante anonimato.</p>;

  if (step === "preview") {
    const box = (k: keyof Consents, label: string) => (
      <label className="flex min-h-12 items-start gap-3 text-lg text-foreground"><input type="checkbox" checked={c[k]} onChange={(e) => setC({ ...c, [k]: e.target.checked })} className="mt-1 h-6 w-6 shrink-0" />{label}</label>
    );
    return (
      <AppShell>
        <h1 className="font-display text-3xl text-foreground">Revise antes de enviar</h1>
        <p className="text-base text-muted-foreground">Este é exatamente o texto que será enviado.</p>
        <article className="space-y-2 rounded-3xl bg-card p-5 ring-1 ring-border">
          <p className="text-sm text-muted-foreground">{themeLabel(d.theme)}</p>
          <h2 className="text-2xl font-semibold text-foreground">{d.title}</h2>
          <p className="text-base text-muted-foreground">por {d.pseudonym}</p>
          {d.warnings.length > 0 && <p className="text-sm text-muted-foreground">Avisos: {d.warnings.map(warningLabel).join(", ")}</p>}
          <StoryText text={d.body} />
        </article>
        {privacy}
        <div className="space-y-2">
          {box("rules", "Li e aceito as regras da comunidade: respeito, sem culpar ninguém, sem dados pessoais, sem pedidos de dinheiro.")}
          {box("moderation", "Aceito que meu texto seja lido pela moderação antes de qualquer publicação.")}
          {box("display", "Se aprovado, aceito que ele seja exibido para outras usuárias com conta no app.")}
        </div>
        {wasPublished && <p className="text-base text-muted-foreground">Ao enviar a edição, o relato sai do mural até ser revisado de novo.</p>}
        <button disabled={!allConsented(c) || busy} onClick={submit} className={primaryBtn}>Enviar para moderação</button>
        <button onClick={() => setStep("edit")} className={secondaryBtn}>Voltar e editar</button>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Link to="/comunidade" className="text-primary underline">← Comunidade</Link>
      <h1 className="font-display text-3xl text-foreground">Compartilhar minha história</h1>
      {privacy}
      <label className="block space-y-2"><span className="text-lg font-semibold text-foreground">Título</span>
        <input maxLength={LIMITS.title[1]} value={d.title} onChange={(e) => set("title", e.target.value)} className={fieldClass} /></label>
      <label className="block space-y-2"><span className="text-lg font-semibold text-foreground">Sua história</span>
        <textarea maxLength={LIMITS.body[1]} rows={10} value={d.body} onChange={(e) => set("body", e.target.value)} className={fieldClass} />
        <span className="text-sm text-muted-foreground">{d.body.trim().length} / {LIMITS.body[1]} (mínimo {LIMITS.body[0]})</span></label>
      <label className="block space-y-2"><span className="text-lg font-semibold text-foreground">Tema</span>
        <select value={d.theme} onChange={(e) => set("theme", e.target.value)} className={`${fieldClass} min-h-12`}>
          <option value="">Escolha um tema</option>
          {THEMES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select></label>
      <label className="block space-y-2"><span className="text-lg font-semibold text-foreground">Pseudônimo (só da comunidade)</span>
        <input maxLength={LIMITS.pseudonym[1]} value={d.pseudonym} onChange={(e) => set("pseudonym", e.target.value)} className={fieldClass} /></label>
      <fieldset className="space-y-2"><legend className="text-lg font-semibold text-foreground">Avisos de conteúdo (opcional)</legend>
        {WARNINGS.map((w) => (
          <label key={w.id} className="flex min-h-12 items-center gap-3 text-lg text-foreground">
            <input type="checkbox" className="h-5 w-5" checked={d.warnings.includes(w.id)} onChange={(e) => set("warnings", e.target.checked ? [...d.warnings, w.id] : d.warnings.filter((x) => x !== w.id))} />{w.label}
          </label>
        ))}</fieldset>
      {err && <p className="text-base text-muted-foreground">{err}</p>}
      <button disabled={!!err || busy} onClick={() => setStep("preview")} className={primaryBtn}>Revisar antes de enviar</button>
      <button disabled={!!err || busy} onClick={async () => { if (await save()) toast.success(wasPublished ? "Salvo. O relato saiu do mural até nova revisão." : "Rascunho salvo."); }} className={secondaryBtn}>Salvar rascunho</button>
    </AppShell>
  );
}
