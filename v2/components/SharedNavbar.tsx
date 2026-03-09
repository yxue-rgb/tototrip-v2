"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/contexts/I18nContext";
import { Menu, X, Plane, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

interface SharedNavbarProps {
  /** Key of the currently active nav item (e.g. "guides", "inspiration") for highlight */
  activePage?: string;
}

const NAV_LINKS = [
  { key: "destinations", href: "/#destinations" },
  { key: "inspiration", href: "/inspiration" },
  { key: "guides", href: "/guides" },
  { key: "toolkit", href: "/toolkit" },
];

export function SharedNavbar({ activePage }: SharedNavbarProps) {
  const router = useRouter();
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const supabaseEnabled = false;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStartChat = () => {
    router.push(`/chat/temp-${Date.now()}`);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#E0C4BC]/30 dark:border-white/10"
      role="banner"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/brand/toto_logo_plain.png"
            alt="toto"
            width={80}
            height={28}
            className="h-7 w-auto dark:hidden"
            priority
          />
          <Image
            src="/brand/toto_logo_plain_light.png"
            alt="toto"
            width={80}
            height={28}
            className="h-7 w-auto hidden dark:block"
            priority
          />
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive = activePage === link.key;
            const label = t(`nav.${link.key}`);
            return isActive ? (
              <span
                key={link.key}
                className="px-3 py-2 text-sm font-medium text-[#E95331] bg-[#E95331]/10 rounded-lg"
              >
                {label}
              </span>
            ) : (
              <a
                key={link.key}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-[#083022]/70 dark:text-slate-400 hover:text-[#083022] dark:hover:text-white rounded-lg hover:bg-[#E0C4BC]/20 dark:hover:bg-white/10 transition-all duration-200"
              >
                {label}
              </a>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/trips")}
                className="hidden md:flex items-center gap-2 text-[#083022]/70 dark:text-slate-400 hover:text-[#083022] dark:hover:text-white"
              >
                <Plane className="h-4 w-4" />
                {t("nav.myTrips")}
              </Button>
              <div className="hidden md:flex items-center gap-2 text-sm text-[#083022]/70 dark:text-slate-400 px-2">
                <div className="w-7 h-7 rounded-full bg-[#083022] flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="max-w-[120px] truncate">
                  {user.fullName || user.email}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="hidden md:inline-flex text-sm border-[#E0C4BC] dark:border-white/15 dark:text-slate-300 hover:border-[#083022]"
              >
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleStartChat}
              size="sm"
              className="hidden md:inline-flex bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-md shadow-[#E95331]/20 border-0 text-sm"
            >
              {t("nav.startPlanning") || "Start Planning 🐕"}
            </Button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#083022] dark:text-slate-400 hover:text-[#083022] dark:hover:text-white hover:bg-[#E0C4BC]/20 dark:hover:bg-white/10 transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu backdrop */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-white/95 dark:bg-[#0d2a1f]/95 backdrop-blur-xl border-b border-[#E0C4BC]/30 dark:border-white/10 shadow-elevated relative z-50"
        >
          <div className="container mx-auto px-4 py-4 space-y-1">
            <a href="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-[#083022] dark:text-slate-300 hover:text-[#E95331] hover:bg-[#E0C4BC]/20 dark:hover:bg-[#E95331]/10 rounded-xl transition-all duration-200">
              {t("nav.home")}
            </a>
            {NAV_LINKS.map((link) => {
              const isActive = activePage === link.key;
              const label = t(`nav.${link.key}`);
              return isActive ? (
                <span key={link.key} className="block px-4 py-3 text-sm font-medium text-[#E95331] bg-[#E95331]/10 rounded-xl">
                  {label}
                </span>
              ) : (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-[#083022] dark:text-slate-300 hover:text-[#E95331] hover:bg-[#E0C4BC]/20 dark:hover:bg-[#E95331]/10 rounded-xl transition-all duration-200"
                >
                  {label}
                </a>
              );
            })}

            <div className="border-t border-[#E0C4BC]/30 dark:border-white/10 my-2" />

            {user ? (
              <div className="space-y-1">
                <button
                  onClick={() => { router.push("/trips"); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-medium text-[#083022] dark:text-slate-300 hover:text-[#E95331] hover:bg-[#E0C4BC]/20 dark:hover:bg-[#E95331]/10 rounded-xl transition-all"
                >
                  <Plane className="h-4 w-4" />
                  {t("nav.myTrips")}
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-[#083022] dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all"
                >
                  {t("nav.logout")}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-4 pt-2 pb-1">
                <Button
                  onClick={() => { handleStartChat(); setMobileMenuOpen(false); }}
                  className="w-full bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-md shadow-[#E95331]/20 border-0 text-sm"
                >
                  {t("nav.startPlanning") || "Start Planning 🐕"}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
