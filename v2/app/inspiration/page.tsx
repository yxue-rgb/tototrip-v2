"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Star,
  Sparkles,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/contexts/I18nContext";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import {
  TRIP_TEMPLATES,
  THEME_LABELS,
  THEME_EMOJIS,
  type TripTemplate,
} from "@/lib/trip-templates";

/* ─── FadeUp (simple animate, no whileInView) ─── */
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(delay, 0.3), ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Theme badge color ─── */
function themeColor(theme: string) {
  const map: Record<string, string> = {
    classic: "bg-[#083022] text-white",
    food: "bg-[#E95331] text-white",
    nature: "bg-[#6BBFAC] text-white",
    adventure: "bg-[#E7B61B] text-[#083022]",
    culture: "bg-[#C999C5] text-white",
    photography: "bg-[#99B7CF] text-white",
  };
  return map[theme] || "bg-slate-500 text-white";
}

/* ─── Template Card ─── */
function TemplateCard({
  template,
  onUse,
  index,
}: {
  template: TripTemplate;
  onUse: () => void;
  index: number;
}) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25 }}
        className="group cursor-pointer bg-white dark:bg-[#0d2a1f] rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden shadow-soft card-hover"
      >
        {/* Cover Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={template.coverImage}
            alt={template.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {/* Duration badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-md">
              <Calendar className="h-3 w-3 text-[#E95331]" />
              {template.days} day{template.days !== 1 ? 's' : ''}
            </span>
          </div>
          {/* Theme badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${themeColor(template.theme)}`}>
              {THEME_EMOJIS[template.theme]} {THEME_LABELS[template.theme]}
            </span>
          </div>
          {/* Bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="text-white font-bold text-lg leading-tight mb-0.5">
              {template.title}
            </h3>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4">
          {/* Cities route */}
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            <MapPin className="h-3 w-3 text-[#E95331] flex-shrink-0" />
            {template.cities.map((city, i) => (
              <span key={city} className="text-xs text-slate-500 dark:text-slate-400">
                {city}
                {i < template.cities.length - 1 && (
                  <span className="text-slate-300 dark:text-slate-600 ml-1">→</span>
                )}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
            {template.description}
          </p>

          {/* Highlights */}
          <div className="space-y-1.5 mb-4">
            {template.highlights.slice(0, 3).map((h, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <Star className="h-3 w-3 text-[#E7B61B] mt-0.5 flex-shrink-0" />
                <span className="text-xs text-slate-600 dark:text-slate-400 leading-snug">{h}</span>
              </div>
            ))}
          </div>

          {/* Budget + CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/10">
            <div>
              <span className="text-[10px] text-slate-400 block">{t("inspiration.estBudget")}</span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{template.budgetRange}</span>
            </div>
            <Button
              size="sm"
              onClick={(e) => { e.stopPropagation(); onUse(); }}
              className="bg-[#E95331] hover:bg-[#d44a2b] text-white border-0 shadow-md shadow-[#E95331]/15 rounded-xl text-xs font-semibold gap-1"
            >
              {t("inspiration.usePlan")}
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Inspiration Page ─── */
export default function InspirationPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [activeTheme, setActiveTheme] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredTemplates = useMemo(() => {
    if (activeTheme === "all") return TRIP_TEMPLATES;
    return TRIP_TEMPLATES.filter((t) => t.theme === activeTheme);
  }, [activeTheme]);

  const handleUsePlan = (template: TripTemplate) => {
    trackEvent('template_used', { template: template.title });
    // Save to localStorage
    try {
      const saved = JSON.parse(localStorage.getItem("tototrip-saved-templates") || "[]");
      if (!saved.find((s: any) => s.id === template.id)) {
        saved.push(template);
        localStorage.setItem("tototrip-saved-templates", JSON.stringify(saved));
      }
    } catch (e) {}

    toast.success(`📋 "${template.title}" saved! Starting chat...`);

    // Navigate to chat
    const message = `I'd like to plan a trip based on the "${template.title}" itinerary (${template.days} days). The cities are: ${template.cities.join(", ")}. Please help me customize it!`;
    const tempId = `temp-${Date.now()}`;
    router.push(`/chat/${tempId}?q=${encodeURIComponent(message)}`);
  };

  const themeKeys = ["all", "classic", "culture", "food", "nature", "adventure", "photography"];

  return (
    <div className="min-h-screen bg-[var(--brand-cream)] dark:bg-[#0a1a13]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#E0C4BC]/30 dark:border-white/10" role="banner">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
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
            />
            <Image
              src="/brand/toto_logo_plain_light.png"
              alt="toto"
              width={80}
              height={28}
              className="h-7 w-auto hidden dark:block"
            />
          </button>

          <nav className="hidden md:flex items-center gap-1">
            <a
              href="/"
              className="px-3 py-2 text-sm font-medium text-[#083022]/70 dark:text-slate-400 hover:text-[#083022] dark:hover:text-white rounded-lg hover:bg-[#E0C4BC]/20 dark:hover:bg-white/10 transition-all"
            >
              {t("nav.home")}
            </a>
            <span className="px-3 py-2 text-sm font-medium text-[#E95331] bg-[#E95331]/10 rounded-lg">
              {t("nav.inspiration")}
            </span>
            <a
              href="/toolkit"
              className="px-3 py-2 text-sm font-medium text-[#083022]/70 dark:text-slate-400 hover:text-[#083022] dark:hover:text-white rounded-lg hover:bg-[#E0C4BC]/20 dark:hover:bg-white/10 transition-all"
            >
              {t("nav.toolkit")}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Button
              onClick={() => router.push(`/chat/temp-${Date.now()}`)}
              size="sm"
              className="hidden md:inline-flex bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-md shadow-[#E95331]/20 border-0 text-sm"
            >
              {t("nav.startPlanning")}
            </Button>

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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 dark:bg-[#0d2a1f]/95 backdrop-blur-xl border-b border-[#E0C4BC]/30 dark:border-white/10 shadow-elevated relative z-50"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              <a href="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-[#083022] dark:text-slate-300 hover:text-[#E95331] hover:bg-[#E0C4BC]/20 dark:hover:bg-[#E95331]/10 rounded-xl transition-all">
                {t("nav.home")}
              </a>
              <span className="block px-4 py-3 text-sm font-medium text-[#E95331] bg-[#E95331]/10 rounded-xl">
                {t("nav.inspiration")}
              </span>
              <div className="border-t border-[#E0C4BC]/30 dark:border-white/10 my-2" />
              <div className="px-4 pt-2 pb-1">
                <Button onClick={() => { router.push(`/chat/temp-${Date.now()}`); setMobileMenuOpen(false); }} className="w-full bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-md shadow-[#E95331]/20 border-0 text-sm">
                  {t("nav.startPlanning")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero */}
      <section className="pt-16">
        <div className="hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-30" />
          <div className="absolute top-20 left-[10%] w-64 h-64 bg-[#6BBFAC]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-[15%] w-80 h-80 bg-[#E7B61B]/8 rounded-full blur-[100px]" />

          <div className="relative container mx-auto px-4 max-w-5xl py-12 sm:py-14 md:py-16 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-[#E7B61B] px-4 py-1.5 rounded-full text-sm font-semibold border border-white/10 mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                {t("inspiration.badge")}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-white tracking-tight leading-tight mb-4">
                {t("inspiration.title")}{" "}
                <span className="text-gradient-brand">{t("inspiration.titleHighlight")}</span>
              </h1>
              <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
                {t("inspiration.subtitle")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Theme Tabs */}
      <section className="py-8 px-4 sticky top-16 z-40 bg-[var(--brand-cream)]/90 dark:bg-[#0a1a13]/90 backdrop-blur-md border-b border-[#E0C4BC]/20 dark:border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {themeKeys.map((key) => {
              const isActive = activeTheme === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTheme(key)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#083022] text-white shadow-md dark:bg-white dark:text-[#083022]"
                      : "bg-white dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10"
                  }`}
                >
                  <span>{THEME_EMOJIS[key]}</span>
                  {THEME_LABELS[key]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Template Grid */}
      <section className="py-4 sm:py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filteredTemplates.map((template, i) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={() => handleUsePlan(template)}
                index={i}
              />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 relative mx-auto mb-4">
                <Image
                  src="/brand/totos/nature_toto.png"
                  alt="Toto exploring"
                  fill
                  className="object-contain animate-float"
                  sizes="80px"
                />
              </div>
              <p className="text-slate-400 dark:text-slate-500">{t("inspiration.noTemplates") !== "inspiration.noTemplates" ? t("inspiration.noTemplates") : "No templates found for this theme. Try another!"}</p>
            </div>
          )}

          {/* Bottom CTA */}
          <FadeUp delay={0.1} className="mt-10 text-center">
            <div className="bg-white dark:bg-[#0d2a1f] rounded-2xl border border-slate-100 dark:border-white/10 shadow-soft p-8 sm:p-10 max-w-2xl mx-auto">
              <div className="w-16 h-16 relative mx-auto mb-4">
                <Image
                  src="/brand/totos/pool_toto.png"
                  alt="Toto relaxing"
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
              <h3 className="text-2xl font-display text-slate-900 dark:text-white mb-2">
                {t("inspiration.customTitle")}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                {t("inspiration.customDesc")}
              </p>
              <Button
                onClick={() => router.push(`/chat/temp-${Date.now()}`)}
                size="lg"
                className="h-12 px-6 bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-lg shadow-[#E95331]/15 rounded-2xl border-0 font-semibold"
              >
                {t("inspiration.createCustom")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-[#083022] border-t border-[#6BBFAC]/10">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <Image
              src="/brand/toto_logo_plain_light.png"
              alt="toto"
              width={80}
              height={28}
              className="h-6 w-auto"
            />
          </div>
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>
        </div>
      </footer>
    </div>
  );
}
