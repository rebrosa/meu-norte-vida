/** Today's date in the user's local timezone as YYYY-MM-DD. */
export function todayISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseISODate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

/** Whole calendar days between a YYYY-MM-DD date and today (never negative). */
export function daysSince(iso: string | null | undefined, now: Date = new Date()): number | null {
  if (!iso) return null;
  const start = parseISODate(iso);
  if (!start) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((today.getTime() - start.getTime()) / 86_400_000);
  return Math.max(0, diff);
}

/** Formats YYYY-MM-DD as a Brazilian date, e.g. 03/11/2026. */
export function formatDateBR(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = parseISODate(iso.slice(0, 10));
  return d ? d.toLocaleDateString("pt-BR") : "";
}

/** Seconds as mm:ss. */
export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export const PAUSE_MINUTES = 15;
