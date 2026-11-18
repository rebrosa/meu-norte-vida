import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, fieldClass, primaryBtn } from "@/components/app/AppShell";
import { CommunityGate, CommunityNotice, StoryText } from "@/components/community/CommunityGate";
import { accessQuery, myReactionsQuery, REACTIONS, REPORT_REASONS, reportStory, storyQuery, themeLabel, toggleReaction, warningLabel } from "@/lib/community";

export const Route = createFileRoute("/_authenticated/comunidade/relato/$id")({
  head: () => ({ meta: [{ title: "Comunidade — Reality Check" }, { name: "description", content: "Espaço de leitura e partilha." }, { property: "og:title", content: "Comunidade — Reality Check" }, { property: "og:description", content: "Espaço de leitura e partilha." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  loader: async ({ context, params }) => {
    const a = await context.queryClient.ensureQueryData(accessQuery);
    if (a.enabled) await Promise.all([context.queryClient.fetchQuery(storyQuery(params.id)), context.queryClient.ensureQueryData(myReactionsQuery(params.id))]);
  },
  component: () => <CommunityGate><Relato /></CommunityGate>,
});

function Relato() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data: s } = useSuspenseQuery(storyQuery(id));
  const { data: mine } = useSuspenseQuery(myReactionsQuery(id));
  const [showWarn, setShowWarn] = useState(true);
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);

  if (!s) return <AppShell><h1 className="font-display text-3xl text-foreground">História indisponível</h1><p className="text-lg text-muted-foreground">Ela pode ter sido retirada pela autora ou pela moderação.</p><Link to="/comunidade/mural" search={{ page: 1, tema: undefined }} className="text-primary underline">Voltar às histórias</Link></AppShell>;

  async function react(kind: string) {
    try { await toggleReaction(id, kind); await qc.invalidateQueries({ queryKey: ["community", "my-reactions", id] }); }
    catch (e) { toast.error((e as Error).message); }
  }
  async function report(e: React.FormEvent) {
    e.preventDefault(); if (!reason) return; setBusy(true);
    try { await reportStory(id, reason, details); toast.success("Denúncia enviada à moderação. Obrigada."); setReporting(false); setReason(""); setDetails(""); }
    catch (err) { toast.error((err as Error).message); } finally { setBusy(false); }
  }

  return (
    <AppShell>
      <Link to="/comunidade/mural" search={{ page: 1, tema: undefined }} className="text-primary underline">← Histórias</Link>
      <p className="text-sm text-muted-foreground">{themeLabel(s.theme)}</p>
      <h1 className="font-display text-3xl text-foreground">{s.title}</h1>
      <p className="text-base text-muted-foreground">por {s.pseudonym}</p>
      {s.content_warnings.length > 0 && showWarn ? (
        <div className="space-y-3 rounded-3xl bg-secondary p-5 text-secondary-foreground">
          <p className="text-lg">Esta história fala de: {s.content_warnings.map(warningLabel).join(", ")}. Leia só se sentir que é um bom momento.</p>
          <button onClick={() => setShowWarn(false)} className={primaryBtn}>Quero ler</button>
        </div>
      ) : <StoryText text={s.body} />}
      <div className="flex flex-wrap gap-2" aria-label="Reações">
        {REACTIONS.map((r) => {
          const on = mine.includes(r.id);
          return <button key={r.id} aria-pressed={on} onClick={() => react(r.id)} className={`min-h-12 rounded-2xl px-4 text-base ${on ? "bg-primary text-primary-foreground" : "bg-card ring-1 ring-border text-foreground"}`}>{r.label}</button>;
        })}
      </div>
      <p className="text-sm text-muted-foreground">Ninguém vê quem reagiu.</p>
      {!reporting ? <button onClick={() => setReporting(true)} className="min-h-12 self-start text-base text-muted-foreground underline">Denunciar esta história</button> : (
        <form onSubmit={report} className="space-y-3 rounded-3xl bg-card p-5 ring-1 ring-border">
          <p className="text-lg font-semibold text-foreground">Por que você está denunciando?</p>
          {REPORT_REASONS.map((r) => (
            <label key={r.id} className="flex min-h-12 items-center gap-3 text-lg text-foreground"><input type="radio" name="reason" value={r.id} checked={reason === r.id} onChange={() => setReason(r.id)} className="h-5 w-5" />{r.label}</label>
          ))}
          <textarea maxLength={1000} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Detalhes (opcional)" className={fieldClass} rows={3} />
          <p className="text-sm text-muted-foreground">A autora não fica sabendo quem denunciou. A história não é removida automaticamente.</p>
          <button disabled={!reason || busy} className={primaryBtn}>Enviar denúncia</button>
          <button type="button" onClick={() => setReporting(false)} className="min-h-12 w-full text-primary underline">Cancelar</button>
        </form>
      )}
      <CommunityNotice />
    </AppShell>
  );
}
