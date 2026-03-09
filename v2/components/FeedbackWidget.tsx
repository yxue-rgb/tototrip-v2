"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquarePlus, X, Send } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

type FeedbackType = "bug" | "feature" | "general";

interface FeedbackEntry {
  id: string;
  type: FeedbackType;
  message: string;
  timestamp: string;
  locale: string;
  url: string;
  userAgent: string;
}

const FEEDBACK_LABELS: Record<string, Record<FeedbackType, string>> = {
  en: { bug: "🐛 Bug", feature: "✨ Feature", general: "💬 General" },
  zh: { bug: "🐛 问题反馈", feature: "✨ 功能建议", general: "💬 一般反馈" },
};

const TEXTS: Record<string, Record<string, string>> = {
  en: {
    title: "Send Feedback",
    placeholder: "Tell us what's on your mind…",
    submit: "Send",
    thanks: "Thanks for your feedback! 🐕",
    empty: "Please write something before submitting.",
  },
  zh: {
    title: "发送反馈",
    placeholder: "告诉我们你的想法…",
    submit: "发送",
    thanks: "感谢你的反馈！🐕",
    empty: "请先写点什么再提交。",
  },
};

export function FeedbackWidget() {
  const { locale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("general");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lang = locale === "zh" ? "zh" : "en";
  const t = TEXTS[lang];
  const labels = FEEDBACK_LABELS[lang];

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.warning(t.empty);
      return;
    }

    setSubmitting(true);

    const entry: FeedbackEntry = {
      id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      locale: lang,
      url: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    };

    try {
      const existing = JSON.parse(localStorage.getItem("tototrip_feedback") || "[]");
      existing.push(entry);
      localStorage.setItem("tototrip_feedback", JSON.stringify(existing));
    } catch {
      // If localStorage fails, still show success
    }

    trackEvent('feedback_submitted', { type });

    setTimeout(() => {
      setSubmitting(false);
      setMessage("");
      setType("general");
      setIsOpen(false);
      toast.success(t.thanks);
    }, 300);
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full
              bg-[#083022] dark:bg-[#6BBFAC] text-white dark:text-[#083022]
              shadow-lg hover:shadow-xl
              flex items-center justify-center
              transition-shadow duration-200
              hover:scale-105 active:scale-95
              md:w-14 md:h-14"
            aria-label="Send feedback"
          >
            <MessageSquarePlus className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Feedback panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="fixed z-50
                bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto
                w-full md:w-[380px]
                bg-white dark:bg-[#0f1f1a]
                md:rounded-2xl rounded-t-2xl
                shadow-2xl border border-[#6BBFAC]/20 dark:border-[#6BBFAC]/10
                overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#6BBFAC]/10">
                <h3 className="text-base font-semibold text-[#083022] dark:text-white flex items-center gap-2">
                  <MessageSquarePlus className="w-4 h-4 text-[#6BBFAC]" />
                  {t.title}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[#083022]/5 dark:hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-[#083022]/60 dark:text-white/60" />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-4 space-y-4">
                {/* Type selector */}
                <div className="flex gap-2">
                  {(Object.keys(labels) as FeedbackType[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setType(key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                        ${
                          type === key
                            ? "bg-[#083022] text-white dark:bg-[#6BBFAC] dark:text-[#083022] shadow-sm"
                            : "bg-[#083022]/5 text-[#083022]/60 dark:bg-white/5 dark:text-white/50 hover:bg-[#083022]/10 dark:hover:bg-white/10"
                        }`}
                    >
                      {labels[key]}
                    </button>
                  ))}
                </div>

                {/* Message textarea */}
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.placeholder}
                  rows={4}
                  maxLength={1000}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none
                    bg-[#083022]/[0.03] dark:bg-white/5
                    border border-[#6BBFAC]/15 dark:border-[#6BBFAC]/10
                    text-[#083022] dark:text-white
                    placeholder:text-[#083022]/30 dark:placeholder:text-white/30
                    focus:outline-none focus:ring-2 focus:ring-[#6BBFAC]/30 focus:border-[#6BBFAC]/40
                    transition-all duration-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleSubmit();
                    }
                  }}
                />

                {/* Character count + submit */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#083022]/30 dark:text-white/30">
                    {message.length}/1000
                  </span>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !message.trim()}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium
                      bg-[#083022] text-white dark:bg-[#6BBFAC] dark:text-[#083022]
                      hover:opacity-90 active:scale-[0.98]
                      disabled:opacity-40 disabled:cursor-not-allowed
                      transition-all duration-200"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {t.submit}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
