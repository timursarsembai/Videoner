"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LANGUAGES,
  Language,
  Translations,
  translations,
} from "./translations";

const STORAGE_KEY = "language";

// Все допустимые пути ключей вида "nav.home", "platforms.youtube.description".
type NestedKeys<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : `${K}.${NestedKeys<T[K]>}`;
}[keyof T & string];

export type TranslationKey = NestedKeys<Translations>;

type Params = Record<string, string | number>;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Params) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function resolve(dict: Translations, key: string): string {
  // Спускаемся по точечному пути; если ключа нет — возвращаем сам ключ (видимый маркер).
  const value = key
    .split(".")
    .reduce<unknown>(
      (acc, part) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[part]
          : undefined,
      dict
    );
  return typeof value === "string" ? value : key;
}

function interpolate(template: string, params?: Params): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in params ? String(params[name]) : match
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // На сервере и при первом рендере — английский (избегаем расхождения гидрации),
  // затем в эффекте подтягиваем сохранённый выбор из localStorage.
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (LANGUAGES as readonly string[]).includes(stored)) {
      setLanguageState(stored as Language);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Params) =>
      interpolate(resolve(translations[language], key), params),
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
