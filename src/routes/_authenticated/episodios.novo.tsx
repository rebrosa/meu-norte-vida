import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, fieldClass, primaryBtn } from "@/components/app/AppShell";
import { todayISO } from "@/lib/dates";
import { useI18n } from "@/lib/i18n";
import { createEpisode } from "@/lib/journal";

export const Route = createFileRoute("/_authenticated/episodios/novo")({
  head: () => ({
    meta: [
      { title: "New entry — Reality Check" },
      { name: "description", content: "Write down what happened." },
      { property: "og:title", content: "New entry — Reality Check" },
      { property: "og:description", content: "Write down what happened." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NovoEpisodio,
});

// Stored in Portuguese so entries stay consistent across languages; shown translated.
const SUGGESTED_TAGS = [
  "ciúme",
  "controle",
  "gritos",
  "humilhação",
  "isolamento",
  "dinheiro",
  "mentira",
  "ameaça",
];

function NovoEpisodio() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [date, setDate] = useState(todayISO());
  const [what, setWhat] = useState("");
  const [felt, setFelt] = useState("");
  const [almost, setAlmost] = useState("");
  const [intensity, setIntensity] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [saving, setSaving] = useState(false);

  function toggleTag(tag: string) {
    setTags((cur) => (cur.includes(tag) ? cur.filter((x) => x !== tag) : [...cur, tag]));
  }
  function addCustom() {
    const tag = customTag.trim().toLowerCase();
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setCustomTag("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!what.trim()) return;
    setSaving(true);
    try {
      await createEpisode({
        occurred_on: date,
        what_happened: what,
        how_felt: felt,
        almost_did: almost,
        intensity,
        tags,
      });
      await queryClient.invalidateQueries({ queryKey: ["episodes"] });
      toast.success(t("Registro salvo."));
      navigate({ to: "/episodios" });
    } catch {
      toast.error(t("Não foi possível salvar. Tente de novo."));
      setSaving(false);
    }
  }

  const allTags = [...SUGGESTED_TAGS, ...tags.filter((tag) => !SUGGESTED_TAGS.includes(tag))];

  return (
    <AppShell>
      <h1 className="font-display text-3xl text-foreground">{t("Novo registro")}</h1>
      <p className="text-base text-muted-foreground">
        {t(
          "Escreva apenas o que se sentir confortável em compartilhar consigo mesma. Não há resposta certa ou errada. Você pode parar a qualquer momento, sem reviver os detalhes.",
        )}
      </p>
      <form onSubmit={submit} className="space-y-6">
        <Field label={t("Data")} htmlFor="date">
          <input
            id="date"
            type="date"
            max={todayISO()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${fieldClass} min-h-12`}
          />
        </Field>
        <Field label={t("O que aconteceu?")} htmlFor="what">
          <textarea
            id="what"
            required
            rows={5}
            maxLength={5000}
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field label={t("Como me senti?")} htmlFor="felt">
          <textarea
            id="felt"
            rows={3}
            maxLength={3000}
            value={felt}
            onChange={(e) => setFelt(e.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field label={t("O que eu quase fiz?")} htmlFor="almost">
          <textarea
            id="almost"
            rows={3}
            maxLength={3000}
            value={almost}
            onChange={(e) => setAlmost(e.target.value)}
            className={fieldClass}
          />
        </Field>

        <fieldset className="space-y-3">
          <legend className="text-lg font-semibold text-foreground">{t("Intensidade")}</legend>
          <p className="text-base text-muted-foreground">
            {t(
              "Como você sentiu esse momento, não uma avaliação do que aconteceu. É opcional.",
            )}
          </p>
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={intensity === n}
                onClick={() => setIntensity(intensity === n ? null : n)}
                className={`min-h-12 flex-1 rounded-2xl text-lg font-semibold ring-1 ring-border ${intensity === n ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="flex justify-between text-sm text-muted-foreground">
            <span>{t("leve")}</span>
            <span>{t("muito forte")}</span>
          </p>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-lg font-semibold text-foreground">{t("Marcadores")}</legend>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                aria-pressed={tags.includes(tag)}
                onClick={() => toggleTag(tag)}
                className={`min-h-12 rounded-full px-4 text-base ring-1 ring-border ${tags.includes(tag) ? "bg-primary text-primary-foreground" : "bg-card text-foreground"}`}
              >
                {t(tag)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              aria-label={t("Novo marcador")}
              placeholder={t("Outro marcador")}
              value={customTag}
              maxLength={40}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustom();
                }
              }}
              className={`${fieldClass} min-h-12 py-2`}
            />
            <button
              type="button"
              onClick={addCustom}
              className="min-h-12 rounded-2xl bg-secondary px-5 font-semibold text-secondary-foreground"
            >
              {t("Adicionar")}
            </button>
          </div>
        </fieldset>

        <button disabled={saving || !what.trim()} className={primaryBtn}>
          {saving ? t("Salvando…") : t("Salvar registro")}
        </button>
      </form>
    </AppShell>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-lg font-semibold text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
