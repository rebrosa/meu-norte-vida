import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app/AppShell";
import { accessQuery } from "@/lib/community";

export function CommunityGate({ children, moderatorOnly = false }: { children: ReactNode; moderatorOnly?: boolean }) {
  const { data } = useSuspenseQuery(accessQuery);
  const ok = moderatorOnly ? data.moderator : data.enabled;
  if (!ok) {
    return (
      <AppShell>
        <h1 className="font-display text-3xl text-foreground">Ainda não disponível</h1>
        <p className="text-lg text-muted-foreground">
          {moderatorOnly ? "Esta área é só para a moderação." : "Este espaço ainda está em preparação e será aberto com cuidado."}
        </p>
        <Link to="/inicio" className="text-lg text-primary underline">Voltar ao início</Link>
      </AppShell>
    );
  }
  return <>{children}</>;
}

export function CommunityNotice() {
  return (
    <p className="rounded-2xl bg-secondary p-4 text-base text-secondary-foreground">
      A comunidade não é um serviço de emergência. Se você estiver em perigo, ligue 190 ou 180, ou abra{" "}
      <Link to="/ajuda" className="underline">Preciso de ajuda</Link>.
    </p>
  );
}

export function StoryText({ text }: { text: string }) {
  // Rendered as plain text only — never as HTML.
  return <div className="whitespace-pre-wrap break-words text-lg leading-relaxed text-foreground">{text}</div>;
}
