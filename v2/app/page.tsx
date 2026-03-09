"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MessageCircle,
  Globe,
  Sparkles,
  User,
  History,
  MapPin,
  Plane,
  Languages,
  Compass,
  Shield,
  ChevronRight,
  Star,
  CreditCard,
  Train,
  Wifi,
  UtensilsCrossed,
  Search,
  Quote,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/contexts/I18nContext";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import { motion, useInView } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent } from "@/lib/analytics";

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

/* ─── City image data (non-translatable) ─── */
const CITY_KEYS = ["beijing", "shanghai", "chengdu", "xian", "guilin", "hongkong", "hangzhou", "kunming", "lhasa", "harbin"] as const;
const CITY_IMAGES: Record<string, string> = {
  beijing: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop",
  shanghai: "https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&h=600&fit=crop",
  chengdu: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop",
  xian: "https://images.unsplash.com/photo-1725933014999-e70ae6e57375?w=800&h=600&fit=crop",
  guilin: "https://images.unsplash.com/photo-1759322451543-68c2217e9046?w=800&h=600&fit=crop",
  hongkong: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&h=600&fit=crop",
  hangzhou: "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800&h=600&fit=crop",
  kunming: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&h=600&fit=crop",
  lhasa: "https://images.unsplash.com/photo-1609073575309-f6d1aa4b07c2?w=800&h=600&fit=crop",
  harbin: "https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800&h=600&fit=crop",
};

/* ─── City metadata for enhanced cards ─── */
const CITY_META: Record<string, { temp: string; weather: string; tags: string[] }> = {
  beijing: { temp: "15°C", weather: "☀️", tags: ["History", "Culture", "Architecture"] },
  shanghai: { temp: "18°C", weather: "⛅", tags: ["Modern", "Nightlife", "Shopping"] },
  chengdu: { temp: "20°C", weather: "🌤️", tags: ["Food", "Pandas", "Tea Culture"] },
  xian: { temp: "16°C", weather: "☀️", tags: ["History", "Silk Road", "Street Food"] },
  guilin: { temp: "22°C", weather: "🌤️", tags: ["Nature", "Photography", "Cycling"] },
  hongkong: { temp: "24°C", weather: "⛅", tags: ["Food", "Shopping", "Harbour"] },
  hangzhou: { temp: "19°C", weather: "🌸", tags: ["West Lake", "Tea", "Tech Hub"] },
  kunming: { temp: "20°C", weather: "🌺", tags: ["Eternal Spring", "Ethnic", "Nature"] },
  lhasa: { temp: "12°C", weather: "☀️", tags: ["Tibetan", "Sacred", "High Altitude"] },
  harbin: { temp: "-15°C", weather: "❄️", tags: ["Ice Festival", "Russian", "Winter"] },
};

/* ─── Pain point config (icons & colors, brand palette) ─── */
const PAIN_POINT_KEYS = ["payment", "rail", "vpn", "food", "language", "safety"] as const;
const PAIN_POINT_CONFIG: Record<string, { icon: typeof CreditCard; color: string; bg: string; border: string }> = {
  payment: { icon: CreditCard, color: "text-[#6BBFAC]", bg: "bg-[#6BBFAC]/10", border: "border-[#6BBFAC]/20" },
  rail: { icon: Train, color: "text-[#99B7CF]", bg: "bg-[#99B7CF]/10", border: "border-[#99B7CF]/20" },
  vpn: { icon: Wifi, color: "text-[#C999C5]", bg: "bg-[#C999C5]/10", border: "border-[#C999C5]/20" },
  food: { icon: UtensilsCrossed, color: "text-[#E95331]", bg: "bg-[#E95331]/10", border: "border-[#E95331]/20" },
  language: { icon: Languages, color: "text-[#E7B61B]", bg: "bg-[#E7B61B]/10", border: "border-[#E7B61B]/20" },
  safety: { icon: Shield, color: "text-[#9E552D]", bg: "bg-[#9E552D]/10", border: "border-[#9E552D]/20" },
};

/* ─── Testimonial keys & avatars ─── */
const TESTIMONIAL_KEYS = ["sarah", "marcus", "yuki"] as const;
const TESTIMONIAL_META: Record<string, { avatar: string; rating: number }> = {
  sarah: { avatar: "S", rating: 5 },
  marcus: { avatar: "M", rating: 5 },
  yuki: { avatar: "Y", rating: 4 },
};

/* ─── Quick tag keys ─── */
const QUICK_TAG_KEYS = ["beijing", "shanghai", "chengdu", "foodTour", "historyCulture"] as const;

/* ─── How It Works mascots ─── */
const HOW_IT_WORKS_TOTOS = [
  { toto: "/brand/totos/nature_toto.png", label: "Toto exploring nature" },
  { toto: "/brand/totos/foodie_toto.png", label: "Toto experiencing local food" },
  { toto: "/brand/totos/family_toto.png", label: "Toto connecting with people" },
];

/* ─── Animated counter ─── */
function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  label,
  icon,
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: React.ReactNode;
  decimals?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "100px" });
  const [count, setCount] = useState(end);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;
    const startVal = end * 0.8;
    let current = startVal;
    setCount(current);
    const duration = 800;
    const totalSteps = duration / 16;
    const step = (end - startVal) / totalSteps;
    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setCount(current);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  const displayValue = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center px-4"
    >
      <div className="flex items-center justify-center mb-2">{icon}</div>
      <div className="text-3xl md:text-4xl font-bold text-[#083022] dark:text-slate-100 tabular-nums">
        {prefix}
        {displayValue}
        {suffix}
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{label}</div>
    </motion.div>
  );
}

/* ─── Star rating ─── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? "text-[#E7B61B] fill-[#E7B61B]" : "text-slate-200 dark:text-slate-600 fill-slate-200 dark:fill-slate-600"
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Fade up on scroll ─── */
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
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();
  const { user, logout, session } = useAuth();
  const supabaseEnabled = false; // Auth temporarily disabled — Supabase not configured
  const { t } = useI18n();
  const [destination, setDestination] = useState("");
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [recentSessions, setRecentSessions] = useState<ChatSession[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (session?.access_token) loadRecentSessions();
  }, [session]);

  const loadRecentSessions = async () => {
    try {
      const response = await fetch("/api/sessions", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (response.ok) {
        const { sessions: sessionList } = await response.json();
        setRecentSessions(sessionList.slice(0, 5));
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  };

  const handleStartChat = async (message?: string) => {
    trackEvent('cta_start_planning');
    const query = message || destination;
    setIsCreatingSession(true);
    try {
      if (session?.access_token) {
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ title: query || "New Chat" }),
        });
        if (response.ok) {
          const { session: newSession } = await response.json();
          const url = query
            ? `/chat/${newSession.id}?q=${encodeURIComponent(query)}`
            : `/chat/${newSession.id}`;
          router.push(url);
          return;
        }
      }
      const tempId = `temp-${Date.now()}`;
      const url = query
        ? `/chat/${tempId}?q=${encodeURIComponent(query)}`
        : `/chat/${tempId}`;
      router.push(url);
    } catch {
      const tempId = `temp-${Date.now()}`;
      const url = query
        ? `/chat/${tempId}?q=${encodeURIComponent(query)}`
        : `/chat/${tempId}`;
      router.push(url);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleCityClick = (cityName: string) => {
    handleStartChat(`Plan a trip to ${cityName}`);
  };

  const handleQuickTag = (tag: string) => {
    if (["Beijing", "Shanghai", "Chengdu"].includes(tag)) {
      handleStartChat(`Plan a trip to ${tag}`);
    } else {
      handleStartChat(`I'm interested in a ${tag} experience in China`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a1a13]">
      {/* ─── Navigation ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#E0C4BC]/30 dark:border-white/10" role="banner">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
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
          </div>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {[
              { label: t("nav.destinations"), href: "#destinations" },
              { label: t("nav.inspiration"), href: "/inspiration" },
              { label: "Guides", href: "/guides" },
              { label: t("nav.toolkit"), href: "/toolkit" },
              { label: t("nav.whyTototrip"), href: "#why-tototrip" },
              { label: t("nav.howItWorks"), href: "#how-it-works" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-[#083022]/70 dark:text-slate-400 hover:text-[#083022] dark:hover:text-white rounded-lg hover:bg-[#E0C4BC]/20 dark:hover:bg-white/10 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

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
            ) : supabaseEnabled ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/auth")}
                  className="hidden md:inline-flex text-sm text-[#083022]/70 dark:text-slate-400 hover:text-[#083022] dark:hover:text-white"
                >
                  {t("nav.login")}
                </Button>
                <Button
                  onClick={() => router.push("/auth")}
                  size="sm"
                  className="hidden md:inline-flex bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-md shadow-[#E95331]/20 border-0 text-sm"
                >
                  {t("nav.getStarted")}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => handleStartChat()}
                size="sm"
                className="hidden md:inline-flex bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-md shadow-[#E95331]/20 border-0 text-sm"
              >
                {t("nav.startPlanning") || "Start Planning 🐕"}
              </Button>
            )}

            {/* Mobile hamburger button */}
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

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 dark:bg-[#0d2a1f]/95 backdrop-blur-xl border-b border-[#E0C4BC]/30 dark:border-white/10 shadow-elevated relative z-50"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {[
                { label: t("nav.home"), href: "/" },
                { label: t("nav.destinations"), href: "#destinations" },
                { label: t("nav.inspiration"), href: "/inspiration" },
                { label: "Guides", href: "/guides" },
                { label: t("nav.toolkit"), href: "/toolkit" },
                { label: t("nav.whyTototrip"), href: "#why-tototrip" },
                { label: t("nav.howItWorks"), href: "#how-it-works" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-[#083022] dark:text-slate-300 hover:text-[#E95331] hover:bg-[#E0C4BC]/20 dark:hover:bg-[#E95331]/10 rounded-xl transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}

              <div className="px-4 py-2">
                <LanguageToggle />
              </div>

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
              ) : supabaseEnabled ? (
                <div className="flex flex-col gap-2 px-4 pt-2 pb-1">
                  <Button
                    variant="outline"
                    onClick={() => { router.push("/auth"); setMobileMenuOpen(false); }}
                    className="w-full text-sm border-[#E0C4BC] dark:border-white/15 dark:text-slate-300"
                  >
                    {t("nav.login")}
                  </Button>
                  <Button
                    onClick={() => { router.push("/auth"); setMobileMenuOpen(false); }}
                    className="w-full bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-md shadow-[#E95331]/20 border-0 text-sm"
                  >
                    {t("nav.getStarted")}
                  </Button>
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

      <main>
      {/* ─── Hero Section — Deep Green ─── */}
      <section className="relative pt-16 overflow-hidden z-0" aria-label="Hero">
        <div className="hero-gradient relative">
          <div className="absolute inset-0 bg-dot-pattern opacity-30" />
          <div className="absolute top-20 left-[10%] w-64 h-64 bg-[#6BBFAC]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-[15%] w-80 h-80 bg-[#E7B61B]/8 rounded-full blur-[100px]" />

          <div className="relative container mx-auto px-4 max-w-5xl pt-14 pb-12 md:pt-20 md:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="inline-flex items-center gap-2 mb-8"
              >
                <span className="inline-flex items-center gap-1.5 bg-white/10 text-[#E7B61B] px-4 py-1.5 rounded-full text-sm font-semibold border border-white/10 backdrop-blur-sm font-subtitle">
                  <Sparkles className="h-3.5 w-3.5" />
                  THE SMART TRAVEL GUIDE
                </span>
              </motion.div>

              {/* Heading — Amelie Fierce */}
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.08] mb-5">
                <span className="text-white">{t("hero.titleLine1")}</span>
                <br />
                <span className="text-white">{t("hero.titleLine2")}</span>
                <span className="text-gradient-brand">{t("hero.titleHighlight")}</span>
              </h1>

              <p className="text-lg md:text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
                {t("hero.subtitle")}
              </p>

              {/* Mini Chat Input — Hero search box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="max-w-2xl mx-auto mb-6"
              >
                <div
                  className={`hero-search-wrapper p-[2px] rounded-2xl transition-all duration-500 ${
                    searchFocused ? "hero-search-active" : ""
                  }`}
                >
                  <div className="flex items-center bg-[#083022]/90 backdrop-blur-md rounded-[14px] overflow-hidden border border-white/10">
                    <span className="ml-5 text-lg flex-shrink-0">🐕</span>
                    <input
                      type="text"
                      placeholder={t("hero.searchPlaceholder")}
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && destination.trim()) {
                          handleStartChat();
                        }
                      }}
                      className="flex-1 h-14 md:h-16 px-4 bg-transparent text-white placeholder:text-white/30 text-base md:text-lg outline-none"
                    />
                    <Button
                      onClick={() => handleStartChat()}
                      disabled={isCreatingSession}
                      className="h-10 md:h-11 px-5 md:px-6 mr-2 bg-[#E95331] hover:bg-[#d44a2b] text-white rounded-xl border-0 font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#E95331]/30"
                    >
                      {isCreatingSession ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <MessageCircle className="h-4 w-4" />
                          <span className="hidden sm:inline">{t("hero.searchButton")}</span>
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Quick trip tags — pill buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-2"
              >
                {[
                  { labelKey: "quickTags.beijing3d", label: "Beijing 3 days", query: "Plan a 3-day trip to Beijing" },
                  { labelKey: "quickTags.silkRoad", label: "Silk Road", query: "Plan a Silk Road adventure in China" },
                  { labelKey: "quickTags.chengduFood", label: "Chengdu Food Tour", query: "Plan a food tour in Chengdu" },
                  { labelKey: "quickTags.firstTime", label: "First time in China", query: "I'm visiting China for the first time, help me plan!" },
                ].map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => handleStartChat(tag.query)}
                    className="px-4 py-2 text-sm font-medium text-white/70 bg-white/8 hover:bg-white/15 hover:text-white border border-white/15 rounded-full transition-all duration-200 hover:border-[#6BBFAC]/50 hover:shadow-lg hover:shadow-[#6BBFAC]/10"
                  >
                    {t(tag.labelKey) !== tag.labelKey ? t(tag.labelKey) : tag.label}
                  </button>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Trust Badges ─── */}
      <section className="relative z-0 py-5 px-4 bg-[var(--brand-cream)] dark:bg-[#0a1a13] border-b border-[#E0C4BC]/20 dark:border-white/5">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <Sparkles className="h-4 w-4 text-[#E7B61B]" />
              <span className="text-xs font-semibold uppercase tracking-wider">Powered by Google AI</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <Globe className="h-4 w-4 text-[#6BBFAC]" />
              <span className="text-xs font-semibold uppercase tracking-wider">50+ Cities Covered</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <MessageCircle className="h-4 w-4 text-[#99B7CF]" />
              <span className="text-xs font-semibold uppercase tracking-wider">24/7 AI Travel Companion</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <Shield className="h-4 w-4 text-[#C999C5]" />
              <span className="text-xs font-semibold uppercase tracking-wider">Free to Use</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Popular Destinations ─── */}
      <section id="destinations" className="relative z-0 py-10 md:py-14 px-4 bg-[var(--brand-cream)] dark:bg-[#0a1a13]">
        <div className="container mx-auto max-w-6xl">
          <FadeUp className="text-center mb-8">
            <span className="text-sm font-semibold text-[#E95331] tracking-wide uppercase mb-2 block font-subtitle">
              {t("destinations.sectionLabel")}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-[#083022] dark:text-white tracking-tight mb-4">
              {t("destinations.title")}
              <br />
              <span className="text-gradient-brand">{t("destinations.titleHighlight")}</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-4">
              {t("destinations.subtitle")}
            </p>
            <a
              href="/inspiration"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E95331] hover:text-[#d44a2b] transition-colors"
            >
              <Compass className="h-4 w-4" />
              {t("destinations.viewItineraries")}
              <ChevronRight className="h-4 w-4" />
            </a>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {CITY_KEYS.map((key, i) => {
              const name = t(`destinations.${key}.name`);
              const chinese = t(`destinations.${key}.chinese`);
              const desc = t(`destinations.${key}.desc`);
              const tag = t(`destinations.${key}.tag`);
              const image = CITY_IMAGES[key];
              const meta = CITY_META[key];
              return (
                <FadeUp key={key} delay={i * 0.06}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="destination-card group cursor-pointer relative overflow-hidden rounded-2xl aspect-[4/3]"
                    onClick={() => handleCityClick(name)}
                  >
                    <ImageWithSkeleton
                      src={image}
                      alt={`${name} - ${desc}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-100"
                      loading="lazy"
                    />
                    {/* Enhanced gradient overlay with vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#083022]/85 via-[#083022]/30 to-[#083022]/10 z-10 transition-all duration-300 group-hover:from-[#083022]/90 group-hover:via-[#083022]/40" />
                    {/* Corner vignette */}
                    <div className="absolute inset-0 z-10" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)" }} />

                    {/* Weather badge — top left */}
                    <div className="absolute top-3 left-3 z-20">
                      <span className="inline-flex items-center gap-1 bg-white/90 dark:bg-[#083022]/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                        <span>{meta.weather}</span> {meta.temp}
                      </span>
                    </div>

                    {/* Arrow — top right */}
                    <div className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight className="h-3.5 w-3.5 text-white" />
                    </div>

                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 md:p-5">
                      <span className="inline-flex items-center gap-1 text-[#6BBFAC] text-xs font-medium mb-1 tracking-wide uppercase">
                        <MapPin className="h-3 w-3" />
                        {tag}
                      </span>
                      <h3 className="text-white font-bold text-xl md:text-2xl leading-tight mb-1">
                        {name}
                        <span className="text-white/50 text-base font-normal ml-2">
                          {chinese}
                        </span>
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-2">
                        {desc}
                      </p>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {meta.tags.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-white/15 backdrop-blur-sm text-white/80 text-[10px] font-medium rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Why TotoTrip — Pain Points Solved ─── */}
      <section id="why-tototrip" className="relative z-0 py-10 md:py-14 px-4 bg-[var(--brand-cream)] dark:bg-[#0d1f17]">
        <div className="container mx-auto max-w-6xl">
          <FadeUp className="text-center mb-8">
            <span className="text-sm font-semibold text-[#6BBFAC] tracking-wide uppercase mb-2 block font-subtitle">
              {t("whyTotoTrip.sectionLabel")}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-[#083022] dark:text-white tracking-tight mb-4">
              {t("whyTotoTrip.title")}
              <span className="text-gradient-brand">{t("whyTotoTrip.titleHighlight")}</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {t("whyTotoTrip.subtitle")}
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4">
            {PAIN_POINT_KEYS.map((key, i) => {
              const cfg = PAIN_POINT_CONFIG[key];
              const Icon = cfg.icon;
              return (
                <FadeUp key={key} delay={i * 0.08}>
                  <div className={`group p-6 bg-white dark:bg-[#0d2a1f] rounded-2xl border ${cfg.border} dark:border-white/10 shadow-soft card-hover h-full`}>
                    <div className={`w-12 h-12 ${cfg.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 ${cfg.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-[#083022] dark:text-white mb-2">
                      {t(`whyTotoTrip.painPoints.${key}.title`)}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t(`whyTotoTrip.painPoints.${key}.desc`)}
                    </p>
                  </div>
                </FadeUp>
              );
            })}
          </div>

          {/* Mascot CTA row */}
          <FadeUp delay={0.3} className="mt-8 text-center">
            <div className="inline-flex items-center gap-4 bg-white dark:bg-[#0d2a1f] rounded-2xl border border-[#E0C4BC]/30 dark:border-white/10 shadow-soft px-6 py-4">
              <div className="w-12 h-12 relative flex-shrink-0">
                <Image
                  src="/brand/totos/pool_toto.png"
                  alt="Toto mascot relaxing by the pool"
                  fill
                  className="object-contain"
                  sizes="48px"
                  loading="lazy"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#083022] dark:text-white">{t("cta.badge")}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{t("whyTotoTrip.subtitle")}</p>
              </div>
              <Button
                onClick={() => handleStartChat()}
                size="sm"
                className="bg-[#E95331] hover:bg-[#d44a2b] text-white border-0 rounded-xl shadow-md shadow-[#E95331]/15 text-xs font-semibold"
              >
                <MessageCircle className="h-3.5 w-3.5 mr-1" />
                {t("nav.chat")}
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── How It Works — with Toto mascots ─── */}
      <section id="how-it-works" className="relative z-0 py-10 md:py-14 px-4 bg-white dark:bg-[#0a1a13]">
        <div className="container mx-auto max-w-4xl">
          <FadeUp className="text-center mb-8">
            <span className="text-sm font-semibold text-[#E95331] tracking-wide uppercase mb-2 block font-subtitle">
              {t("howItWorks.sectionLabel")}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-[#083022] dark:text-white tracking-tight mb-4">
              {t("howItWorks.title")}
              <span className="text-gradient-brand">{t("howItWorks.titleHighlight")}</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              {t("howItWorks.subtitle")}
            </p>
          </FadeUp>

          <div className="space-y-0">
            {[
              { number: "01", stepKey: "step1", color: "text-[#E95331]", bg: "bg-[#E95331]/10", totoIdx: 0 },
              { number: "02", stepKey: "step2", color: "text-[#E7B61B]", bg: "bg-[#E7B61B]/10", totoIdx: 1 },
              { number: "03", stepKey: "step3", color: "text-[#6BBFAC]", bg: "bg-[#6BBFAC]/10", totoIdx: 2 },
            ].map((step, i) => (
              <FadeUp key={step.number} delay={i * 0.12}>
                <div className="timeline-connector flex gap-6 items-start py-5">
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div
                      className={`w-12 h-12 ${step.bg} dark:bg-white/10 rounded-2xl flex items-center justify-center`}
                    >
                      <span className={`${step.color} font-bold text-lg font-subtitle`}>
                        {step.number}
                      </span>
                    </div>
                    {/* Toto mascot */}
                    <div className="w-16 h-16 relative hidden md:block">
                      <Image
                        src={HOW_IT_WORKS_TOTOS[step.totoIdx].toto}
                        alt={HOW_IT_WORKS_TOTOS[step.totoIdx].label}
                        fill
                        className="object-contain"
                        sizes="64px"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-bold text-[#083022] dark:text-white mb-2">
                      {t(`howItWorks.steps.${step.stepKey}.title`)}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t(`howItWorks.steps.${step.stepKey}.desc`)}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Social Proof / Stats ─── */}
      <section className="relative z-0 py-10 md:py-14 px-4 bg-[var(--brand-cream)] dark:bg-[#0d1f17]">
        <div className="container mx-auto max-w-6xl">
          <FadeUp className="text-center mb-8">
            <span className="text-sm font-semibold text-[#E7B61B] tracking-wide uppercase mb-2 block font-subtitle">
              {t("socialProof.sectionLabel")}
            </span>
            <h2 className="text-3xl md:text-5xl font-display text-[#083022] dark:text-white tracking-tight mb-4">
              {t("socialProof.title")}
              <span className="text-gradient-brand">{t("socialProof.titleHighlight")}</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {t("socialProof.subtitle")}
            </p>
          </FadeUp>

          {/* Stats — compact horizontal row with big numbers */}
          <div className="flex flex-wrap items-center justify-center gap-0 mb-10 bg-white dark:bg-[#0d2a1f] rounded-2xl border border-[#E0C4BC]/30 dark:border-white/10 shadow-soft overflow-hidden divide-x divide-[#E0C4BC]/20 dark:divide-white/10">
            {[
              { icon: <Compass className="h-5 w-5 text-[#E95331]" />, value: "50+", label: t("socialProof.stats.citiesCovered") },
              { icon: <Globe className="h-5 w-5 text-[#6BBFAC]" />, value: "10", label: t("socialProof.stats.curatedItineraries") },
              { icon: <Sparkles className="h-5 w-5 text-[#E7B61B]" />, value: "AI", label: t("socialProof.stats.poweredByAI") },
              { icon: <MessageCircle className="h-5 w-5 text-[#99B7CF]" />, value: "24/7", label: t("socialProof.stats.alwaysAvailable") },
            ].map((stat, i) => (
              <div key={i} className="flex-1 min-w-[120px] text-center py-5 px-3">
                <div className="flex items-center justify-center mb-1.5">{stat.icon}</div>
                <div className="text-3xl md:text-5xl font-bold text-[#083022] dark:text-slate-100 font-display leading-none">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials — enhanced with avatars & ratings */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {TESTIMONIAL_KEYS.map((key, i) => {
              const meta = TESTIMONIAL_META[key];
              const avatarColors = ["bg-[#E95331]", "bg-[#6BBFAC]", "bg-[#E7B61B]"];
              return (
                <FadeUp key={key} delay={i * 0.08}>
                  <div className="relative p-5 bg-white dark:bg-[#0d2a1f] rounded-2xl border border-[#E0C4BC]/30 dark:border-white/10 shadow-soft h-full flex flex-col card-hover">
                    {/* Top: avatar + name + rating */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full ${avatarColors[i]} flex items-center justify-center shadow-md flex-shrink-0`}>
                        <span className="text-sm font-bold text-white">
                          {meta.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#083022] dark:text-slate-100 truncate">{t(`socialProof.testimonials.${key}.name`)}</p>
                        <p className="text-xs text-slate-400 truncate">{t(`socialProof.testimonials.${key}.from`)}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <Quote className="h-5 w-5 text-[#E7B61B]/40" />
                      </div>
                    </div>

                    <StarRating rating={meta.rating} />

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-3 flex-1">
                      &ldquo;{t(`socialProof.testimonials.${key}.text`)}&rdquo;
                    </p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Recent Conversations (logged in users) ─── */}
      {user && recentSessions.length > 0 && (
        <section className="py-14 px-4 bg-white dark:bg-[#0a1a13] border-y border-[#E0C4BC]/20 dark:border-white/10">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E95331]/10 flex items-center justify-center">
                  <History className="h-4 w-4 text-[#E95331]" />
                </div>
                <h2 className="text-xl font-bold text-[#083022] dark:text-white">
                  {t("recentSessions.title")}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  recentSessions[0] &&
                  router.push(`/chat/${recentSessions[0].id}`)
                }
                className="text-slate-500 hover:text-[#083022]"
              >
                {t("recentSessions.viewAll")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentSessions.map((sess, i) => (
                <motion.div
                  key={sess.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-4 bg-white dark:bg-[#0d2a1f] rounded-xl border border-[#E0C4BC]/30 dark:border-white/10 card-hover cursor-pointer"
                  onClick={() => router.push(`/chat/${sess.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#E0C4BC]/30 dark:bg-[#6BBFAC]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#E0C4BC]/50 dark:group-hover:bg-[#6BBFAC]/20 transition-colors">
                      <MessageCircle className="h-4 w-4 text-[#E95331]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#083022] dark:text-slate-100 truncate text-sm group-hover:text-[#E95331] transition-colors">
                        {sess.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(sess.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#E95331] transition-colors flex-shrink-0 mt-0.5" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA Section — "PACK LIGHT-HEARTED" ─── */}
      <section className="py-12 md:py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#6BBFAC]/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#E7B61B]/15 rounded-full blur-[120px]" />

        <div className="relative container mx-auto max-w-3xl text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="flex items-center gap-1.5 bg-white/10 text-[#E7B61B] px-3 py-1 rounded-full text-sm font-medium border border-white/10">
                <Star className="h-3.5 w-3.5" />
                {t("cta.badge")}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-white mb-6 tracking-tight">
              PACK
              <br />
              <span className="text-gradient-brand">LIGHT-HEARTED</span>
            </h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <Button
              onClick={() => handleStartChat()}
              size="lg"
              className="h-14 px-8 bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-xl shadow-[#E95331]/20 rounded-2xl border-0 text-base font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-[#E95331]/30 hover:-translate-y-0.5"
            >
              {t("cta.button")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </FadeUp>
        </div>
      </section>

      </main>

      {/* ─── Footer — Deep Green ─── */}
      <footer className="py-12 px-4 bg-[#083022] border-t border-[#6BBFAC]/10" role="contentinfo">
        <div className="container mx-auto max-w-6xl">
          {/* Top: Brand + 4 link columns */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-10">
            {/* Brand column — spans 2 cols on md */}
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <Image
                  src="/brand/toto_logo_plain_light.png"
                  alt="toto"
                  width={80}
                  height={28}
                  className="h-7 w-auto"
                />
              </div>
              <p className="text-[#99B7CF]/60 text-sm font-subtitle tracking-wide mb-2">
                THE SMART TRAVEL GUIDE
              </p>
              <p className="text-white/40 text-sm max-w-sm leading-relaxed">
                {t("footer.description")}
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t("footer.product")}</h4>
              <ul className="space-y-2.5">
                <li><a href="/chat/new" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("nav.chat")}</a></li>
                <li><a href="/inspiration" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("nav.inspiration")}</a></li>
                <li><a href="/guides" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">Guides</a></li>
                <li><a href="/toolkit" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("nav.toolkit")}</a></li>
                <li><a href="#destinations" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("nav.destinations")}</a></li>
              </ul>
            </div>

            {/* Cities */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t("footer.cities")}</h4>
              <ul className="space-y-2.5">
                {CITY_KEYS.map((key) => (
                  <li key={key}>
                    <button
                      onClick={() => handleCityClick(t(`destinations.${key}.name`))}
                      className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors text-left"
                    >
                      {t(`destinations.${key}.name`)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t("footer.company")}</h4>
              <ul className="space-y-2.5">
                <li><a href="/about" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("footer.about")}</a></li>
                <li><a href="/faq" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("footer.faq")}</a></li>
                <li><a href="/privacy" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("footer.privacy")}</a></li>
                <li><a href="/terms" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("footer.terms")}</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t("footer.connect")}</h4>
              <ul className="space-y-2.5">
                <li><a href="https://twitter.com/tototrip" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">Twitter</a></li>
                <li><a href="https://instagram.com/tototrip" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">Instagram</a></li>
                <li><a href="https://reddit.com/r/tototrip" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">Reddit</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-[#6BBFAC]/10 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-sm text-white/30">
              &copy; 2026 toto. {t("footer.allRightsReserved")}
            </p>
            <p className="text-sm text-white/20">
              Powered by toto 🐕
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
