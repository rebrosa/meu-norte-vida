import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { BookOpen, Feather } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, fieldClass, primaryBtn } from "@/components/app/AppShell";
import { daysSince, todayISO } from "@/lib/dates";
import { profileQuery, saveSeparationDate } from "@/lib/journal";

export const Route = createFileRoute("/_authenticated/inicio")({
  head: () => ({
    meta: [
      { title: "Início — Reality Check" },
      { name: "description", content: "Seu diário pessoal." },
      { property: "og:title", content: "Início — Reality Check" },
      { property: "og:description", content: "Seu diário pessoal." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery),
  component: Inicio,
});

function Inicio() {
  const { user } = Route.useRouteContext();
  const { data: profile } = useSuspenseQuery(profileQuery);
  const sepDate = (user.user_metadata?.["separation_date"] as string | undefined) ?? null;
  const days = daysSince(sepDate);
  const name = profile.display_name;

  return (
    <AppShell>
      <header className="space-y-1">
        <p className="text-lg text-muted-foreground">Que bom ver você.</p>
        <h1 className="font-display text-4xl text-foreground">{name ? `Olá, ${name}` : "Olá"}</h1>
      </header>

      {days !== null ? (
        <section className="rounded-3xl bg-secondary p-6 text-center text-secondary-foreground">
          <p className="font-display text-6xl text-primary">{days}</p>
          <p className="mt-1 text-lg">{days === 1 ? "dia" : "dias"} desde que você se afastou</p>
        </section>
      ) : (
        <SeparationDatePrompt />
      )}

      <Link
        to="/voltar"
        className="flex min-h-24 items-center justify-center rounded-3xl bg-accent px-6 text-center text-2xl font-semibold text-accent-foreground shadow-md"
      >
        Estou pensando em voltar
      </Link>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/episodios/novo" className="flex min-h-28 flex-col items-start justify-between rounded-3xl bg-card p-5 ring-1 ring-border">
          <BookOpen className="h-7 w-7 text-primary" aria-hidden />
          <span className="text-lg font-semibold text-foreground">Registrar episódio</span>
        </Link>
        <Link to="/decisao" className="flex min-h-28 flex-col items-start justify-between rounded-3xl bg-card p-5 ring-1 ring-border">
          <Feather className="h-7 w-7 text-primary" aria-hidden />
          <span className="text-lg font-semibold text-foreground">Minha decisão</span>
        </Link>
      </div>

      <Link to="/comunidade" className="flex min-h-16 items-center justify-center rounded-3xl bg-card px-5 text-lg font-semibold text-foreground ring-1 ring-border">
        Comunidade
      </Link>

      <Link to="/ajuda" className="mx-auto inline-flex min-h-12 items-center px-4 text-base text-muted-foreground underline">
        Preciso de ajuda
      </Link>
    </AppShell>
  );
}

function SeparationDatePrompt() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    setSaving(true);
    try {
      await saveSeparationDate(date);
      await router.invalidate();
    } catch {
      toast.error("Não foi possível salvar a data.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-3 rounded-3xl bg-secondary p-5">
      <label htmlFor="sep" className="block text-lg font-semibold text-secondary-foreground">
        Quando você se afastou?
      </label>
      <input id="sep" type="date" max={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} className={`${fieldClass} min-h-12`} />
      <button disabled={!date || saving} className={primaryBtn}>
        Salvar data
      </button>
    </form>
  );
}
