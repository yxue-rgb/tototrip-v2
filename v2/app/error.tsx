"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useI18n } from "@/contexts/I18nContext";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-cream)] dark:bg-[#0a1a13] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        {/* Toto mascot — foodie toto (oops!) */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-24 h-24 relative mx-auto mb-6"
        >
          <Image
            src="/brand/totos/foodie_toto.png"
            alt="Toto"
            fill
            className="object-contain"
            sizes="96px"
          />
        </motion.div>

        <h2 className="text-xl md:text-2xl font-bold text-[#083022] dark:text-white mb-3">
          {t("error.title")}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mb-8 leading-relaxed">
          {t("error.description")}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-md shadow-[#E95331]/15 border-0 h-11 px-6 rounded-xl"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("error.tryAgain")}
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full sm:w-auto border-[#E0C4BC] dark:border-white/15 dark:text-slate-300 hover:border-[#083022] h-11 px-6 rounded-xl"
          >
            <Home className="h-4 w-4 mr-2" />
            {t("error.backHome")}
          </Button>
        </div>

        {/* Error digest for debugging */}
        {error?.digest && (
          <p className="mt-6 text-[10px] text-slate-300 dark:text-slate-600 font-mono-brand">
            Error ID: {error.digest}
          </p>
        )}
      </motion.div>
    </div>
  );
}
