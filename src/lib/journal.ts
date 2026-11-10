// Browser-side data access. Uses the publishable-key client only; every read
// and write is scoped by the existing per-user RLS policies.
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const FEELINGS = ["saudade", "culpa", "solidão", "medo", "esperança"] as const;
export type Feeling = (typeof FEELINGS)[number];

async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const id = data.session?.user.id;
  if (!id) throw new Error("Sua sessão expirou. Entre novamente.");
  return id;
}

export type Episode = {
  id: string;
  occurred_on: string | null;
  what_happened: string;
  how_felt: string | null;
  almost_did: string | null;
  intensity: number | null;
  tags: string[] | null;
  created_at: string | null;
};

const EPISODE_COLS = "id, occurred_on, what_happened, how_felt, almost_did, intensity, tags, created_at";

export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const id = await currentUserId();
    const { data, error } = await supabase.from("profiles").select("display_name").eq("id", id).maybeSingle();
    if (error) throw error;
    return { display_name: data?.display_name ?? null };
  },
});

export const letterQuery = queryOptions({
  queryKey: ["letter"],
  queryFn: async () => {
    const id = await currentUserId();
    const { data, error } = await supabase
      .from("decision_letters")
      .select("id, why_text, future_goals, updated_at")
      .eq("user_id", id)
      .order("updated_at", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const episodesQuery = queryOptions({
  queryKey: ["episodes"],
  queryFn: async (): Promise<Episode[]> => {
    const id = await currentUserId();
    const { data, error } = await supabase
      .from("episodes")
      .select(EPISODE_COLS)
      .eq("user_id", id)
      .order("occurred_on", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const topEpisodesQuery = queryOptions({
  queryKey: ["episodes", "top3"],
  queryFn: async (): Promise<Episode[]> => {
    const id = await currentUserId();
    const { data, error } = await supabase
      .from("episodes")
      .select(EPISODE_COLS)
      .eq("user_id", id)
      .order("intensity", { ascending: false, nullsFirst: false })
      .order("occurred_on", { ascending: false, nullsFirst: false })
      .limit(3);
    if (error) throw error;
    return data ?? [];
  },
});

export async function saveProfileName(displayName: string) {
  const id = await currentUserId();
  const { error } = await supabase
    .from("profiles")
    .upsert({ id, display_name: displayName.trim() || null }, { onConflict: "id" });
  if (error) throw error;
}

/** The schema has no column for this date, so it lives in the user's own account metadata. */
export async function saveSeparationDate(iso: string | null) {
  const { error } = await supabase.auth.updateUser({ data: { separation_date: iso } });
  if (error) throw error;
}

export async function saveLetter(input: { id?: string | null | undefined; why_text: string; future_goals: string }) {
  const userId = await currentUserId();
  const row = { why_text: input.why_text, future_goals: input.future_goals, updated_at: new Date().toISOString() };
  const { error } = input.id
    ? await supabase.from("decision_letters").update(row).eq("id", input.id).eq("user_id", userId)
    : await supabase.from("decision_letters").insert({ ...row, user_id: userId });
  if (error) throw error;
}

export async function createEpisode(input: {
  occurred_on: string;
  what_happened: string;
  how_felt: string;
  almost_did: string;
  intensity: number | null;
  tags: string[];
}) {
  const userId = await currentUserId();
  const { error } = await supabase.from("episodes").insert({
    user_id: userId,
    occurred_on: input.occurred_on || null,
    what_happened: input.what_happened.trim(),
    how_felt: input.how_felt.trim() || null,
    almost_did: input.almost_did.trim() || null,
    intensity: input.intensity,
    tags: input.tags.length ? input.tags : null,
  });
  if (error) throw error;
}

export async function createRelapseEvent(feeling: Feeling): Promise<string> {
  const userId = await currentUserId();
  const { data, error } = await supabase
    .from("relapse_events")
    .insert({ user_id: userId, feeling })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function setRelapseOutcome(id: string, outcome: string) {
  const userId = await currentUserId();
  const { error } = await supabase.from("relapse_events").update({ outcome }).eq("id", id).eq("user_id", userId);
  if (error) throw error;
}

/** Deletes every row the user owns in all five tables. */
export async function deleteAllMyRows() {
  const userId = await currentUserId();
  const results = await Promise.all([
    supabase.from("chat_messages").delete().eq("user_id", userId),
    supabase.from("relapse_events").delete().eq("user_id", userId),
    supabase.from("episodes").delete().eq("user_id", userId),
    supabase.from("decision_letters").delete().eq("user_id", userId),
    supabase.from("profiles").delete().eq("id", userId),
  ]);
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
  await supabase.auth.updateUser({ data: { separation_date: null } });
}
