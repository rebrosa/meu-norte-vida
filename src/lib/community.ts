// Community ("Você não está sozinha"). Reads go through RLS-protected tables;
// every state change goes through backend functions that validate permission,
// transitions, sizes and rate limits. Never touches journal or letters.
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const RULES_VERSION = "2026-11-v1";
export const PAGE_SIZE = 10;

export const THEMES = [
  { id: "separacao", label: "Estou pensando em me separar" },
  { id: "saudade", label: "Saudade e vontade de voltar" },
  { id: "filhos", label: "Filhos e mudanças na família" },
  { id: "vida_pratica", label: "Dinheiro, moradia e vida prática" },
  { id: "limites", label: "Limites e situações difíceis" },
  { id: "recomecos", label: "Recomeços e pequenas conquistas" },
] as const;
export type ThemeId = (typeof THEMES)[number]["id"];
export const themeLabel = (id: string) => THEMES.find((t) => t.id === id)?.label ?? id;
export const isTheme = (v: unknown): v is ThemeId => THEMES.some((t) => t.id === v);

export const WARNINGS = [
  { id: "violencia", label: "Violência" },
  { id: "abuso_emocional", label: "Violência psicológica" },
  { id: "filhos", label: "Filhos" },
  { id: "autolesao", label: "Pensamentos de se machucar" },
  { id: "luto", label: "Luto" },
  { id: "dinheiro", label: "Dinheiro" },
] as const;
export const warningLabel = (id: string) => WARNINGS.find((w) => w.id === id)?.label ?? id;

export const REACTIONS = [
  { id: "identified", label: "Me identifiquei" },
  { id: "thanks", label: "Obrigada por compartilhar" },
  { id: "helped", label: "Sua história me ajudou" },
] as const;

export const REPORT_REASONS = [
  { id: "personal_data", label: "Exposição de dados pessoais" },
  { id: "harassment", label: "Assédio ou culpabilização" },
  { id: "risk", label: "Ameaça ou conteúdo de risco" },
  { id: "spam", label: "Publicidade ou pedido de dinheiro" },
  { id: "other", label: "Outro motivo" },
] as const;

export const STATUS_LABEL: Record<string, string> = {
  draft: "Rascunho",
  pending: "Pendente de revisão",
  published: "Publicado",
  rejected: "Não aprovado",
  withdrawn: "Retirado",
};

export const LIMITS = { title: [3, 120], body: [50, 8000], pseudonym: [2, 40] } as const;

export type StoryDraft = { title: string; body: string; theme: string; pseudonym: string; warnings: string[] };

/** Mirrors backend validation so the person sees problems before sending. */
export function validateDraft(d: StoryDraft): string | null {
  const len = (s: string) => s.trim().length;
  if (len(d.title) < LIMITS.title[0] || len(d.title) > LIMITS.title[1]) return "O título precisa ter entre 3 e 120 caracteres.";
  if (len(d.body) < LIMITS.body[0] || len(d.body) > LIMITS.body[1]) return "O texto precisa ter entre 50 e 8000 caracteres.";
  if (len(d.pseudonym) < LIMITS.pseudonym[0] || len(d.pseudonym) > LIMITS.pseudonym[1]) return "O pseudônimo precisa ter entre 2 e 40 caracteres.";
  if (!isTheme(d.theme)) return "Escolha um tema.";
  return null;
}

export type Consents = { rules: boolean; moderation: boolean; display: boolean };
export const allConsented = (c: Consents) => c.rules && c.moderation && c.display;

async function uid() {
  const { data } = await supabase.auth.getSession();
  const id = data.session?.user.id;
  if (!id) throw new Error("Sua sessão expirou. Entre novamente.");
  return id;
}

export const accessQuery = queryOptions({
  queryKey: ["community", "access"],
  queryFn: async () => {
    const id = await uid();
    const { data, error } = await supabase.from("community_roles").select("role").eq("user_id", id);
    if (error) throw error;
    const roles = (data ?? []).map((r) => r.role);
    return { enabled: roles.length > 0, moderator: roles.includes("moderator") };
  },
});

export type PublishedStory = {
  story_id: string; pseudonym: string; title: string; body: string; theme: string; content_warnings: string[]; published_at: string;
};
const PUB_COLS = "story_id, pseudonym, title, body, theme, content_warnings, published_at";

export const muralQuery = (page: number, tema?: string) =>
  queryOptions({
    queryKey: ["community", "mural", page, tema ?? "all"],
    queryFn: async () => {
      const from = (page - 1) * PAGE_SIZE;
      let q = supabase.from("community_published").select(PUB_COLS).order("published_at", { ascending: false }).range(from, from + PAGE_SIZE);
      if (tema) q = q.eq("theme", tema);
      const { data, error } = await q;
      if (error) throw error;
      const rows = (data ?? []) as PublishedStory[];
      return { stories: rows.slice(0, PAGE_SIZE), hasNext: rows.length > PAGE_SIZE };
    },
  });

export const storyQuery = (id: string) =>
  queryOptions({
    queryKey: ["community", "story", id],
    staleTime: 0,
    queryFn: async () => {
      const { data, error } = await supabase.from("community_published").select(PUB_COLS).eq("story_id", id).maybeSingle();
      if (error) throw error;
      return (data as PublishedStory | null) ?? null;
    },
  });

export const myReactionsQuery = (id: string) =>
  queryOptions({
    queryKey: ["community", "my-reactions", id],
    queryFn: async () => {
      const me = await uid();
      const { data, error } = await supabase.from("community_reactions").select("kind").eq("story_id", id).eq("user_id", me);
      if (error) throw error;
      return (data ?? []).map((r) => r.kind);
    },
  });

export type MyStory = {
  id: string; title: string; body: string; theme: string; pseudonym: string; content_warnings: string[]; status: string; moderator_note: string | null; updated_at: string;
};
const MINE_COLS = "id, title, body, theme, pseudonym, content_warnings, status, moderator_note, updated_at";

export const myStoriesQuery = queryOptions({
  queryKey: ["community", "mine"],
  queryFn: async () => {
    const me = await uid();
    const { data, error } = await supabase.from("community_stories").select(MINE_COLS).eq("author_id", me).order("updated_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as MyStory[];
  },
});

export const myStoryQuery = (id: string) =>
  queryOptions({
    queryKey: ["community", "mine", id],
    queryFn: async () => {
      const me = await uid();
      const { data, error } = await supabase.from("community_stories").select(MINE_COLS).eq("id", id).eq("author_id", me).maybeSingle();
      if (error) throw error;
      return (data as MyStory | null) ?? null;
    },
  });

export const pendingQuery = queryOptions({
  queryKey: ["community", "mod", "pending"],
  queryFn: async () => {
    const { data, error } = await supabase.from("community_stories").select("id, title, body, theme, pseudonym, content_warnings, status, submitted_at")
      .in("status", ["pending", "published"]).order("submitted_at", { ascending: true }).limit(50);
    if (error) throw error;
    return data ?? [];
  },
});

export const reportsQuery = queryOptions({
  queryKey: ["community", "mod", "reports"],
  queryFn: async () => {
    const { data, error } = await supabase.from("community_reports").select("id, story_id, reason, details, created_at")
      .eq("status", "open").order("created_at", { ascending: true }).limit(50);
    if (error) throw error;
    return data ?? [];
  },
});

function check(error: { message: string } | null) {
  if (error) throw new Error(error.message || "Não foi possível concluir agora.");
}

export async function saveStory(id: string | null, d: StoryDraft): Promise<string> {
  const { data, error } = await supabase.rpc("community_save_story", {
    p_id: id as string, p_title: d.title, p_body: d.body, p_theme: d.theme, p_pseudonym: d.pseudonym, p_warnings: d.warnings,
  });
  check(error);
  return data as string;
}
export async function submitStory(id: string, c: Consents) {
  const { error } = await supabase.rpc("community_submit_story", {
    p_id: id, p_rules_version: RULES_VERSION, p_accept_rules: c.rules, p_accept_moderation: c.moderation, p_accept_display: c.display,
  });
  check(error);
}
export async function withdrawStory(id: string) { check((await supabase.rpc("community_withdraw_story", { p_id: id })).error); }
export async function deleteDraft(id: string) { check((await supabase.rpc("community_delete_draft", { p_id: id })).error); }
export async function toggleReaction(id: string, kind: string) {
  const { data, error } = await supabase.rpc("community_toggle_reaction", { p_story: id, p_kind: kind });
  check(error);
  return data as boolean;
}
export async function reportStory(id: string, reason: string, details: string) {
  check((await supabase.rpc("community_report", { p_story: id, p_reason: reason, p_details: details })).error);
}
export async function moderate(id: string, action: "approve" | "reject" | "request_changes" | "withdraw", note: string) {
  check((await supabase.rpc("community_moderate", { p_id: id, p_action: action, p_note: note })).error);
}
export async function reviewReport(id: string, note: string) {
  check((await supabase.rpc("community_review_report", { p_report: id, p_note: note })).error);
}
