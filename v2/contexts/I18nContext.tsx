"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

export type Locale = "en" | "zh";

const messages: Record<Locale, typeof en> = { en, zh };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key: string) => key,
});

/**
 * Resolve a dot-separated key like "nav.destinations" from the messages object.
 */
function resolve(obj: Record<string, any>, path: string): string {
  const parts = path.split(".");
  let current: any = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return path;
    current = current[part];
  }
  return typeof current === "string" ? current : path;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("tototrip-locale") as Locale | null;
    if (stored && (stored === "en" || stored === "zh")) {
      setLocaleState(stored);
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("tototrip-locale", newLocale);
    // Update the html lang attribute
    document.documentElement.lang = newLocale === "zh" ? "zh-CN" : "en";
  }, []);

  const t = useCallback(
    (key: string): string => {
      return resolve(messages[locale], key);
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  // Prevent flash of wrong locale — render children immediately but with default locale
  if (!mounted) {
    return (
      <I18nContext.Provider value={{ locale: "en", setLocale, t: (key) => resolve(messages.en, key) }}>
        {children}
      </I18nContext.Provider>
    );
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
