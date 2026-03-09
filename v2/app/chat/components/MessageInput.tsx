"use client";

import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";

type MessageInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useI18n();

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isActive = input.trim().length > 0;

  return (
    <div className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2a1f] p-4 flex-shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="max-w-3xl mx-auto">
        <div className={`flex items-end gap-2 rounded-2xl border ${
          isActive
            ? "border-[#1a4a3a]/30 dark:border-[#6BBFAC]/30 shadow-[0_0_0_3px_rgba(26,74,58,0.06)] dark:shadow-[0_0_0_3px_rgba(107,191,172,0.06)]"
            : "border-gray-200 dark:border-white/10"
        } bg-white dark:bg-[#0a1a13] p-2 transition-all duration-200`}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("chat.inputPlaceholder")}
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none border-0 bg-transparent text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:outline-none px-2 py-1.5 min-h-[36px] max-h-[160px] leading-relaxed"
          />
          <Button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            size="icon"
            aria-label={t("chat.sendMessage") || "Send message"}
            className={`h-11 w-11 min-h-[44px] min-w-[44px] rounded-xl flex-shrink-0 transition-all duration-200 ${
              isActive
                ? "bg-[#1a4a3a] hover:bg-[#0d2a1f] shadow-md shadow-[#1a4a3a]/15 scale-100"
                : "bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-white/15 scale-95"
            }`}
          >
            <SendHorizontal className={`h-4 w-4 ${isActive ? "text-white" : ""}`} />
          </Button>
        </div>

        <p className="text-[10px] text-gray-400 dark:text-slate-600 mt-2 text-center">
          Powered by toto 🐕 · {t("chat.inputHint")}
        </p>
      </div>
    </div>
  );
}
