import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, fieldClass, primaryBtn } from "@/components/app/AppShell";
import { letterQuery, saveLetter } from "@/lib/journal";

export const Route = createFileRoute("/_authenticated/decisao")({
  head: () => ({
    meta: [
      { title: "Minha carta — Reality Check" },
      { name: "description", content: "Suas palavras, para você mesma." },
      { property: "og:title", content: "Minha carta — Reality Check" },
      { property: "og:description", content: "Suas palavras, para você mesma." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(letterQuery),
  component: Decisao,
});

function Decisao() {
  const queryClient = useQueryClient();
  const { data: letter } = useSuspenseQuery(letterQuery);
  const [why, setWhy] = useState(letter?.why_text ?? "");
  const [goals, setGoals] = useState(letter?.future_goals ?? "");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveLetter({ id: letter?.id, why_text: why, future_goals: goals });
      await queryClient.invalidateQueries({ queryKey: letterQuery.queryKey });
      toast.success("Sua carta foi salva.");
    } catch {
      toast.error("Não foi possível salvar. Tente de novo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <header className="space-y-2">
        <h1 className="font-display text-3xl text-foreground">Minha decisão</h1>
        <p className="text-lg text-muted-foreground">
          Escreva para a pessoa que você será num dia difícil. Ela vai ler isto quando precisar.
        </p>
      </header>
      <form onSubmit={submit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="why" className="block text-lg font-semibold text-foreground">Por que decidi me afastar?</label>
          <textarea id="why" rows={8} maxLength={10000} value={why} onChange={(e) => setWhy(e.target.value)} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor="goals" className="block text-lg font-semibold text-foreground">O que quero para minha vida?</label>
          <textarea id="goals" rows={6} maxLength={10000} value={goals} onChange={(e) => setGoals(e.target.value)} className={fieldClass} />
        </div>
        <button disabled={saving} className={primaryBtn}>{saving ? "Salvando…" : "Salvar carta"}</button>
        {letter?.updated_at && (
          <p className="text-center text-sm text-muted-foreground">
            Última alteração: {new Date(letter.updated_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
          </p>
        )}
      </form>
    </AppShell>
  );
}
