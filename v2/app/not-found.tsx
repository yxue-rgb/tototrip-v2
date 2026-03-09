"use client";

import { Button } from "@/components/ui/button";
import { Home, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useI18n } from "@/contexts/I18nContext";

export default function NotFound() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-cream)] dark:bg-[#0a1a13] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        {/* Toto mascot — nature toto (lost explorer!) */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-28 h-28 relative mx-auto mb-6"
        >
          <Image
            src="/brand/totos/nature_toto.png"
            alt="Toto exploring"
            fill
            className="object-contain animate-float"
            sizes="112px"
          />
        </motion.div>

        {/* 404 text */}
        <h1 className="font-display text-6xl md:text-7xl text-gradient-brand mb-3">
          404
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-[#083022] dark:text-white mb-3">
          {t("notFound.title")}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base mb-8 leading-relaxed">
          {t("notFound.description")}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => router.push("/")}
            className="w-full sm:w-auto bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-md shadow-[#E95331]/15 border-0 h-11 px-6 rounded-xl"
          >
            <Home className="h-4 w-4 mr-2" />
            {t("notFound.backHome")}
          </Button>
          <Button
            onClick={() => router.push("/chat/temp-" + Date.now())}
            variant="outline"
            className="w-full sm:w-auto border-[#E0C4BC] dark:border-white/15 dark:text-slate-300 hover:border-[#083022] h-11 px-6 rounded-xl"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {t("notFound.chatWithToto")}
          </Button>
        </div>

        {/* Explore suggestions */}
        <div className="mt-10 pt-6 border-t border-[#E0C4BC]/30 dark:border-white/10">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 font-subtitle uppercase tracking-wider">
            {t("notFound.popularPages")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "Beijing", href: "/destinations/beijing" },
              { label: "Shanghai", href: "/destinations/shanghai" },
              { label: "Chengdu", href: "/destinations/chengdu" },
              { label: t("nav.inspiration"), href: "/inspiration" },
              { label: t("nav.toolkit"), href: "/toolkit" },
            ].map((link) => (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className="px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0d2a1f] border border-[#E0C4BC]/30 dark:border-white/10 rounded-full hover:border-[#E95331]/40 hover:text-[#E95331] transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
