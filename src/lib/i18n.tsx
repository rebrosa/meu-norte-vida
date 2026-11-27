import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translations } from "@/lib/translations";
import { extraTranslations } from "@/lib/translations.extra";

export type Lang = "en" | "pt-BR" | "de";

export const LANGS: { code: Lang; short: string; name: string }[] = [
  { code: "en", short: "EN", name: "English" },
  { code: "pt-BR", short: "PT", name: "Português" },
  { code: "de", short: "DE", name: "Deutsch" },
];

const STORAGE_KEY = "meu-norte-lang";
export const DEFAULT_LANG: Lang = "en";

function isLang(value: unknown): value is Lang {
  return value === "en" || value === "pt-BR" || value === "de";
}

function detectLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    // storage unavailable
  }
  const nav = (typeof navigator !== "undefined" ? navigator.language : "").toLowerCase();
  if (nav.startsWith("pt")) return "pt-BR";
  if (nav.startsWith("de")) return "de";
  return DEFAULT_LANG;
}

type Vars = Record<string, string | number>;

export function translate(lang: Lang, key: string, vars?: Vars): string {
  const entry = { ...translations[key], ...extraTranslations[key] };
  const raw = entry[lang] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Vars) => string;
};

const I18nContext = createContext<I18nValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key, vars) => translate(DEFAULT_LANG, key, vars),
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    setLangState(detectLang());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage unavailable
    }
  }, []);

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, t: (key: string, vars?: Vars) => translate(lang, key, vars) }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
