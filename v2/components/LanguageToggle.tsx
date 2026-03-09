"use client";

import { useI18n } from "@/contexts/I18nContext";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const { locale, setLocale } = useI18n();

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "zh" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
        locale === "zh"
          ? "bg-red-50 dark:bg-red-500/10 text-[#E95331] hover:bg-red-100 dark:hover:bg-red-500/15"
          : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/15"
      } ${className}`}
      aria-label={locale === "en" ? "切换到中文" : "Switch to English"}
      title={locale === "en" ? "切换到中文" : "Switch to English"}
    >
      <Globe className="h-3.5 w-3.5" />
      <span>{locale === "en" ? "中文" : "EN"}</span>
    </button>
  );
}
