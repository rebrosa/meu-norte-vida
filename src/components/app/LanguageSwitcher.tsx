import { LANGS, useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="group" aria-label={t("Idioma")} className="flex justify-end gap-1">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          title={l.name}
          aria-label={l.name}
          aria-pressed={lang === l.code}
          onClick={() => setLang(l.code)}
          className={`min-h-10 min-w-12 rounded-full px-3 text-sm font-semibold ${
            lang === l.code
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
