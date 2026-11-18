import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { CommunityGate } from "@/components/community/CommunityGate";
import { accessQuery, deleteDraft, myStoriesQuery, STATUS_LABEL, withdrawStory } from "@/lib/community";

export const Route = createFileRoute("/_authenticated/comunidade/meus")({
  head: () => ({ meta: [{ title: "Comunidade — Reality Check" }, { name: "description", content: "Espaço de leitura e partilha." }, { property: "og:title", content: "Comunidade — Reality Check" }, { property: "og:description", content: "Espaço de leitura e partilha." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  loader: async ({ context }) => {
    const a = await context.queryClient.ensureQueryData(accessQuery);
    if (a.enabled) await context.queryClient.ensureQueryData(myStoriesQuery);
  },
  component: () => <CommunityGate><Meus /></CommunityGate>,
});

function Meus() {
  const qc = useQueryClient();
  const { data } = useSuspenseQuery(myStoriesQuery);
  async function run(fn: () => Promise<void>, ok: string) {
    try { await fn(); toast.success(ok); await qc.invalidateQueries({ queryKey: ["community"] }); }
    catch (e) { toast.error((e as Error).message); }
  }
  return (
    <AppShell>
      <Link to="/comunidade" className="text-primary underline">← Comunidade</Link>
      <h1 className="font-display text-3xl text-foreground">Meus relatos</h1>
      <p className="text-base text-muted-foreground">Retirar um relato tira ele do mural. Não conseguimos apagar cópias ou capturas de tela feitas por outras pessoas.</p>
      {data.length === 0 && <p className="text-lg text-muted-foreground">Você ainda não escreveu nenhum relato.</p>}
      <ul className="space-y-4">
        {data.map((s) => (
          <li key={s.id} className="space-y-2 rounded-3xl bg-card p-5 ring-1 ring-border">
            <p className="text-sm font-semibold text-primary">{STATUS_LABEL[s.status] ?? s.status}</p>
            <h2 className="text-xl font-semibold text-foreground">{s.title}</h2>
            {s.moderator_note && <p className="rounded-2xl bg-secondary p-3 text-base text-secondary-foreground">Mensagem da moderação: {s.moderator_note}</p>}
            <div className="flex flex-wrap gap-4">
              {s.status !== "withdrawn" && <Link to="/comunidade/escrever" search={{ id: s.id }} className="min-h-12 p-2 text-primary underline">Editar</Link>}
              {(s.status === "pending" || s.status === "published") && <button onClick={() => confirm("Retirar este relato?") && run(() => withdrawStory(s.id), "Relato retirado.")} className="min-h-12 p-2 text-primary underline">Retirar</button>}
              {s.status === "draft" && <button onClick={() => confirm("Apagar este rascunho?") && run(() => deleteDraft(s.id), "Rascunho apagado.")} className="min-h-12 p-2 text-primary underline">Apagar rascunho</button>}
            </div>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
