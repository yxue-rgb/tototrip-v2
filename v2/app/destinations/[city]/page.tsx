"use client";

import { useParams, useRouter } from "next/navigation";
import { getCityBySlug, getAllCitySlugs } from "@/lib/city-data";
import type { CityData, Attraction, Food, TransportOption, QuickFact } from "@/lib/city-data";
import { useI18n } from "@/contexts/I18nContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Clock,
  Ticket,
  ChevronRight,
  Star,
  Menu,
  X,
  User,
  Plane,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CITIES } from "@/lib/city-data";

/* ─── Fade up helper ─── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function CityDestinationPage() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useI18n();
  const { user, logout, session } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);

  const slug = params.city as string;
  const city = getCityBySlug(slug);

  const isZh = locale === "zh";

  if (!city) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a1a13] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">City not found</h1>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handlePlanTrip = async () => {
    const message = `Plan a trip to ${city.name}`;
    try {
      if (session?.access_token) {
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ title: message }),
        });
        if (response.ok) {
          const { session: newSession } = await response.json();
          router.push(`/chat/${newSession.id}?q=${encodeURIComponent(message)}`);
          return;
        }
      }
      const tempId = `temp-${Date.now()}`;
      router.push(`/chat/${tempId}?q=${encodeURIComponent(message)}`);
    } catch {
      const tempId = `temp-${Date.now()}`;
      router.push(`/chat/${tempId}?q=${encodeURIComponent(message)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a1a13]">
      {/* ─── Navigation ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50 dark:border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <Image src="/brand/toto_logo_plain.png" alt="toto" width={80} height={28} className="h-7 w-auto dark:hidden" />
            <Image src="/brand/toto_logo_plain_light.png" alt="toto" width={80} height={28} className="h-7 w-auto hidden dark:block" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {/* Destinations dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDestDropdownOpen(true)}
              onMouseLeave={() => setDestDropdownOpen(false)}
            >
              <button className="px-3 py-2 text-sm font-medium text-[#E95331] dark:text-[#E95331] rounded-lg bg-red-50/60 dark:bg-red-500/10 flex items-center gap-1 transition-all duration-200">
                {t("nav.destinations")}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {destDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#0d2a1f] rounded-xl border border-slate-100 dark:border-white/10 shadow-elevated overflow-hidden"
                >
                  {CITIES.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/destinations/${c.slug}`}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        c.slug === slug
                          ? "text-[#E95331] bg-red-50/50 dark:bg-red-500/10 font-medium"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="text-base">{isZh ? c.nameZh : c.name}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{isZh ? c.name : c.nameZh}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>

            {[
              { label: t("nav.inspiration"), href: "/inspiration" },
              { label: t("nav.toolkit"), href: "/toolkit" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100/60 dark:hover:bg-white/10 transition-all duration-200"
              >
                {link.label}
              </Link>
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
                  className="hidden md:flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <Plane className="h-4 w-4" />
                  {t("nav.myTrips")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                  className="hidden md:inline-flex text-sm border-slate-200 dark:border-white/15 dark:text-slate-300 hover:border-slate-300"
                >
                  {t("nav.logout")}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => router.push("/auth")}
                size="sm"
                className="hidden md:inline-flex bg-gradient-to-r from-[#E95331] to-[#d44a2b] hover:from-[#d63c34] hover:to-[#b12222] text-white shadow-md shadow-red-500/20 border-0 text-sm"
              >
                {t("nav.getStarted")}
              </Button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/10 transition-all"
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
            className="md:hidden bg-white/95 dark:bg-[#0d2a1f]/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/10 shadow-elevated relative z-50"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-[#E95331] hover:bg-red-50/50 dark:hover:bg-red-500/10 rounded-xl transition-all"
              >
                {t("nav.home")}
              </Link>
              {/* City links */}
              <div className="px-4 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t("nav.destinations")}
              </div>
              {CITIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/destinations/${c.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-6 py-2.5 text-sm ${
                    c.slug === slug ? "text-[#E95331] font-medium" : "text-slate-600 dark:text-slate-400"
                  } hover:text-[#E95331] hover:bg-red-50/50 dark:hover:bg-red-500/10 rounded-xl transition-all`}
                >
                  {isZh ? c.nameZh : c.name} <span className="text-slate-400 dark:text-slate-500">{isZh ? c.name : c.nameZh}</span>
                </Link>
              ))}
              <Link
                href="/inspiration"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-[#E95331] hover:bg-red-50/50 dark:hover:bg-red-500/10 rounded-xl transition-all"
              >
                {t("nav.inspiration")}
              </Link>
              <Link
                href="/toolkit"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-[#E95331] hover:bg-red-50/50 dark:hover:bg-red-500/10 rounded-xl transition-all"
              >
                {t("nav.toolkit")}
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* ─── Hero Banner ─── */}
      <section className="relative pt-16 h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
        <Image
          src={city.heroImage}
          alt={`${city.name} - ${isZh ? city.taglineZh : city.tagline}`}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 z-10" />
        <div className="absolute inset-0 z-20 flex flex-col justify-end">
          <div className="container mx-auto max-w-6xl px-4 pb-10 md:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Link
                  href="/"
                  className="text-white/60 text-sm hover:text-white transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t("nav.home")}
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                <span className="text-white/60 text-sm">{t("nav.destinations")}</span>
                <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                <span className="text-white text-sm font-medium">{isZh ? city.nameZh : city.name}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display text-white tracking-tight mb-3">
                {isZh ? city.nameZh : city.name}
                <span className="text-white/50 text-2xl md:text-3xl font-normal ml-3">
                  {isZh ? city.name : city.nameZh}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
                {isZh ? city.taglineZh : city.tagline}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Quick Facts ─── */}
      <section className="py-10 md:py-14 px-4 bg-white dark:bg-[#0a1a13]">
        <div className="container mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
              {isZh ? "快速了解" : "Quick Facts"}
            </h2>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {city.quickFacts.map((fact: QuickFact, i: number) => (
              <FadeUp key={fact.label} delay={i * 0.05}>
                <div className="p-4 bg-slate-50 dark:bg-[#0d2a1f] rounded-xl border border-slate-100 dark:border-white/10 text-center card-hover">
                  <span className="text-2xl mb-2 block">{fact.icon}</span>
                  <div className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">
                    {isZh ? fact.labelZh : fact.label}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {isZh ? fact.valueZh : fact.value}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Top Attractions ─── */}
      <section className="py-10 md:py-14 px-4 bg-[var(--brand-cream)] dark:bg-[#0D0E14]">
        <div className="container mx-auto max-w-6xl">
          <FadeUp className="mb-8">
            <span className="text-sm font-semibold text-[#E95331] tracking-wide uppercase mb-2 block">
              {isZh ? "必去景点" : "Top Attractions"}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isZh ? `${city.nameZh}不可错过的景点` : `Must-Visit Places in ${city.name}`}
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {city.attractions.map((attraction: Attraction, i: number) => (
              <FadeUp key={attraction.name} delay={i * 0.08}>
                <div className="group bg-white dark:bg-[#0d2a1f] rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden card-hover h-full">
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <ImageWithSkeleton
                      src={attraction.image}
                      alt={`${isZh ? attraction.nameZh : attraction.name} - ${isZh ? attraction.descriptionZh.slice(0, 50) : attraction.description.slice(0, 50)}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      {isZh ? attraction.nameZh : attraction.name}
                      <span className="text-sm text-slate-400 dark:text-slate-500 font-normal ml-2">
                        {isZh ? attraction.name : attraction.nameZh}
                      </span>
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                      {isZh ? attraction.descriptionZh : attraction.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg">
                        <Clock className="h-3.5 w-3.5 text-[#E7B61B]" />
                        {isZh ? attraction.durationZh : attraction.duration}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg">
                        <Ticket className="h-3.5 w-3.5 text-[#E95331]" />
                        {isZh ? attraction.priceZh : attraction.price}
                      </span>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Local Food ─── */}
      <section className="py-10 md:py-14 px-4 bg-white dark:bg-[#0a1a13]">
        <div className="container mx-auto max-w-6xl">
          <FadeUp className="mb-8">
            <span className="text-sm font-semibold text-[#E7B61B] tracking-wide uppercase mb-2 block">
              {isZh ? "必吃美食" : "Local Food"}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isZh ? `${city.nameZh}必吃美食` : `Must-Try Food in ${city.name}`}
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {city.foods.map((food: Food, i: number) => (
              <FadeUp key={food.name} delay={i * 0.08}>
                <div className="group bg-white dark:bg-[#0d2a1f] rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden card-hover h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithSkeleton
                      src={food.image}
                      alt={`${isZh ? food.nameZh : food.name} - ${isZh ? food.descriptionZh.slice(0, 50) : food.description.slice(0, 50)}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-3 right-3 z-10">
                      <span className="text-xs font-semibold bg-white/90 dark:bg-[#0d2a1f]/90 backdrop-blur-sm text-[#E95331] px-2.5 py-1 rounded-full border border-slate-100 dark:border-white/10">
                        {isZh ? food.priceRangeZh : food.priceRange}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      {isZh ? food.nameZh : food.name}
                      <span className="text-sm text-slate-400 dark:text-slate-500 font-normal ml-2">
                        {isZh ? food.name : food.nameZh}
                      </span>
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                      {isZh ? food.descriptionZh : food.description}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Getting Around ─── */}
      <section className="py-10 md:py-14 px-4 bg-slate-50/70 dark:bg-[#0D0E14]">
        <div className="container mx-auto max-w-6xl">
          <FadeUp className="mb-8">
            <span className="text-sm font-semibold text-emerald-600 tracking-wide uppercase mb-2 block">
              {isZh ? "交通出行" : "Getting Around"}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isZh ? `在${city.nameZh}怎么走` : `Getting Around ${city.name}`}
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {city.transport.map((option: TransportOption, i: number) => (
              <FadeUp key={option.mode} delay={i * 0.08}>
                <div className="p-6 bg-white dark:bg-[#0d2a1f] rounded-2xl border border-slate-100 dark:border-white/10 card-hover h-full">
                  <div className="text-3xl mb-3">{option.icon}</div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {isZh ? option.modeZh : option.mode}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isZh ? option.descriptionZh : option.description}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E95331]/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#E7B61B]/15 rounded-full blur-[120px]" />

        <div className="relative container mx-auto max-w-3xl text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-6 tracking-tight">
              {isZh
                ? `准备好探索${city.nameZh}了吗？`
                : `Ready to Explore ${city.name}?`}
            </h2>
            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto leading-relaxed">
              {isZh
                ? "让 AI 旅行助手为你打造完美的个性化行程。"
                : "Let our AI travel assistant craft your perfect personalized itinerary."}
            </p>
            <Button
              onClick={handlePlanTrip}
              size="lg"
              className="h-14 px-8 bg-gradient-to-r from-[#E95331] to-[#E7B61B] hover:from-[#d63c34] hover:to-[#c69845] text-white shadow-xl shadow-red-500/20 rounded-2xl border-0 text-base font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/30 hover:-translate-y-0.5"
            >
              {isZh
                ? `规划${city.nameZh}之旅 →`
                : `Plan your trip to ${city.name} →`}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </FadeUp>
        </div>
      </section>

      {/* ─── Other Cities ─── */}
      <section className="py-10 md:py-14 px-4 bg-white dark:bg-[#0a1a13] border-t border-slate-100 dark:border-white/10">
        <div className="container mx-auto max-w-6xl">
          <FadeUp className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isZh ? "探索更多目的地" : "Explore More Destinations"}
            </h2>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {CITIES.filter((c) => c.slug !== slug).map((c, i) => (
              <FadeUp key={c.slug} delay={i * 0.05}>
                <Link
                  href={`/destinations/${c.slug}`}
                  className="group relative overflow-hidden rounded-xl aspect-[4/3] block"
                >
                  <ImageWithSkeleton
                    src={c.heroImage}
                    alt={isZh ? c.nameZh : c.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 20vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-3">
                    <h3 className="text-white font-bold text-sm md:text-base">
                      {isZh ? c.nameZh : c.name}
                    </h3>
                    <span className="text-white/50 text-xs">{isZh ? c.name : c.nameZh}</span>
                  </div>
                  <div className="absolute top-2 right-2 z-20 w-7 h-7 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-3.5 w-3.5 text-white" />
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-12 px-4 bg-[#083022] border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Image src="/brand/toto_logo_plain_light.png" alt="toto" width={72} height={24} className="h-6 w-auto" />
              <span className="text-[10px] text-white/40 font-subtitle">THE SMART TRAVEL GUIDE</span>
            </div>
            <p className="text-sm text-white/30">
              &copy; {new Date().getFullYear()} {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
