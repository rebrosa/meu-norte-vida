import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { AppShell, fieldClass, primaryBtn, secondaryBtn } from "@/components/app/AppShell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { todayISO } from "@/lib/dates";
import { deleteAllMyRows, profileQuery, saveProfileName, saveSeparationDate } from "@/lib/journal";

export const Route = createFileRoute("/_authenticated/conta")({
  head: () => ({
    meta: [
      { title: "Conta — Reality Check" },
      { name: "description", content: "Preferências da sua conta." },
      { property: "og:title", content: "Conta — Reality Check" },
      { property: "og:description", content: "Preferências da sua conta." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery),
  component: Conta,
});

function Conta() {
  const { user } = Route.useRouteContext();
  const router = useRouter();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile } = useSuspenseQuery(profileQuery);
  const [name, setName] = useState(profile.display_name ?? "");
  const [sep, setSep] = useState((user.user_metadata?.["separation_date"] as string | undefined) ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveProfileName(name);
      await saveSeparationDate(sep || null);
      await queryClient.invalidateQueries({ queryKey: profileQuery.queryKey });
      await router.invalidate();
      toast.success("Salvo.");
    } catch {
      toast.error("Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function deleteEverything() {
    setDeleting(true);
    try {
      await deleteAllMyRows();
      toast.success("Todos os seus dados foram apagados.");
      await signOut();
    } catch {
      toast.error("Não foi possível apagar tudo. Tente de novo.");
      setDeleting(false);
    }
  }

  return (
    <AppShell>
      <h1 className="font-display text-3xl text-foreground">Conta</h1>
      <form onSubmit={save} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-lg font-semibold text-foreground">Como prefere ser chamada?</label>
          <input id="name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} className={`${fieldClass} min-h-12`} />
        </div>
        <div className="space-y-2">
          <label htmlFor="sep" className="block text-lg font-semibold text-foreground">Quando você se afastou?</label>
          <input id="sep" type="date" max={todayISO()} value={sep} onChange={(e) => setSep(e.target.value)} className={`${fieldClass} min-h-12`} />
        </div>
        <button disabled={saving} className={primaryBtn}>{saving ? "Salvando…" : "Salvar"}</button>
      </form>

      <p className="text-base text-muted-foreground">Conectada como {user.email}</p>
      <button onClick={signOut} className={secondaryBtn}>Sair</button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border-2 border-destructive px-6 text-lg font-semibold text-destructive">
            Apagar todos os meus dados
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar tudo?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Seus registros, sua carta, suas pausas, seu nome e sua data serão apagados para sempre. Não dá para desfazer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-12">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                deleteEverything();
              }}
              className="min-h-12 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Apagando…" : "Apagar tudo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <footer className="mt-8 flex gap-3 rounded-2xl bg-card p-4 ring-1 ring-border">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <p className="text-base leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Suas informações são confidenciais.</span>{" "}
          O que você escreve aqui é só seu: seus registros, sua carta e suas pausas ficam guardados no seu nome e
          ninguém mais consegue ler. Você está segura.
        </p>
      </footer>
    </AppShell>
  );
}
