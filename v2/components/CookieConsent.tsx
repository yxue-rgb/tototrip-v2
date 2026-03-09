"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { motion, AnimatePresence } from "framer-motion";

const TEXTS: Record<string, { message: string; accept: string; decline: string }> = {
  en: {
    message: "We use cookies to improve your experience.",
    accept: "Accept",
    decline: "Decline",
  },
  zh: {
    message: "我们使用 Cookie 来改善您的体验。",
    accept: "接受",
    decline: "拒绝",
  },
};

export function CookieConsent() {
  const { locale } = useI18n();
  const [visible, setVisible] = useState(false);
  const lang = locale === "zh" ? "zh" : "en";
  const t = TEXTS[lang];

  useEffect(() => {
    const consent = localStorage.getItem("tototrip_cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("tototrip_cookie_consent", "accepted");
    setVisible(false);
    // Notify Analytics component in the same tab
    window.dispatchEvent(new Event("tototrip_consent_change"));
  };

  const handleDecline = () => {
    localStorage.setItem("tototrip_cookie_consent", "declined");
    setVisible(false);
    window.dispatchEvent(new Event("tototrip_consent_change"));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
        >
          <div className="max-w-xl mx-auto bg-white dark:bg-[#0d2a1f] rounded-2xl border border-[#6BBFAC]/20 dark:border-[#6BBFAC]/10 shadow-2xl px-5 py-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <p className="text-sm text-[#083022] dark:text-slate-200 flex-1 text-center sm:text-left">
              🍪 {t.message}
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleDecline}
                className="px-4 py-2 rounded-xl text-xs font-medium
                  bg-[#083022]/5 dark:bg-white/5
                  text-[#083022]/70 dark:text-white/60
                  hover:bg-[#083022]/10 dark:hover:bg-white/10
                  transition-all duration-200"
              >
                {t.decline}
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 rounded-xl text-xs font-medium
                  bg-[#083022] dark:bg-[#6BBFAC]
                  text-white dark:text-[#083022]
                  hover:opacity-90 active:scale-[0.98]
                  shadow-sm transition-all duration-200"
              >
                {t.accept}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
