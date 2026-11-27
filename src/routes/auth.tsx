import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/app/LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { PASSWORD_NOTE } from "@/lib/translations.extra";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Reality Check" },
      { name: "description", content: "Access your personal journal." },
      { property: "og:title", content: "Sign in — Reality Check" },
      { property: "og:description", content: "Access your personal journal." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setMsg(t("E-mail ou senha incorretos."));
      navigate({ to: "/seguranca" });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setLoading(false);
      if (error) return setMsg(error.message);
      if (data.session) navigate({ to: "/seguranca" });
      else setMsg(t("Enviamos um link de confirmação para o seu e-mail."));
    }
  }

  const input =
    "min-h-12 w-full rounded-2xl border border-border bg-card px-4 text-lg text-foreground outline-none focus:ring-2 focus:ring-ring";

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-5 py-10">
      <LanguageSwitcher />
      <div className="space-y-2 text-center">
        <h1 className="font-display text-4xl text-primary">Reality Check</h1>
        <p className="text-lg text-muted-foreground">{t("Seu espaço privado.")}</p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <input
          className={input}
          type="email"
          required
          placeholder={t("E-mail")}
          aria-label={t("E-mail")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          className={input}
          type="password"
          required
          minLength={6}
          placeholder={t("Senha")}
          aria-label={t("Senha")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "in" ? "current-password" : "new-password"}
        />
        {mode === "up" && (
          <p className="text-base text-muted-foreground">{t(PASSWORD_NOTE)}</p>
        )}
        <button
          disabled={loading}
          className="min-h-12 w-full rounded-2xl bg-primary text-lg font-medium text-primary-foreground disabled:opacity-50"
        >
          {mode === "in" ? t("Entrar") : t("Criar conta")}
        </button>
      </form>
      {msg && (
        <p role="status" className="text-center text-foreground">
          {msg}
        </p>
      )}
      <button
        onClick={() => setMode(mode === "in" ? "up" : "in")}
        className="min-h-12 text-primary underline"
      >
        {mode === "in" ? t("Ainda não tenho conta") : t("Já tenho conta")}
      </button>
    </main>
  );
}
