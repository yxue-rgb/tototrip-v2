"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { SharedNavbar } from "@/components/SharedNavbar";
import { SharedFooter } from "@/components/SharedFooter";
import { GUIDES, GUIDE_CATEGORIES, type Guide } from "@/lib/guides-data";

function CategoryBadge({ category }: { category: Guide["category"] }) {
  const colors: Record<string, string> = {
    "getting-started": "bg-[#6BBFAC]/10 text-[#6BBFAC] border-[#6BBFAC]/20",
    destinations: "bg-[#E95331]/10 text-[#E95331] border-[#E95331]/20",
    tips: "bg-[#E7B61B]/10 text-[#E7B61B] border-[#E7B61B]/20",
  };
  const labels: Record<string, string> = {
    "getting-started": "Getting Started",
    destinations: "Destinations",
    tips: "Tips",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${colors[category]}`}
    >
      {labels[category]}
    </span>
  );
}

function GuideCard({ guide, index }: { guide: Guide; index: number }) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25 }}
        onClick={() => router.push(`/guides/${guide.slug}`)}
        className="group cursor-pointer bg-white dark:bg-[#0d2a1f] rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden shadow-soft card-hover h-full flex flex-col"
      >
        {/* Cover */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={guide.coverImage}
            alt={guide.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute top-3 left-3 z-10">
            <CategoryBadge category={guide.category} />
          </div>
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
              <Clock className="h-3 w-3" />
              {guide.readTime} min
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-[#083022] dark:text-white leading-snug mb-2 group-hover:text-[#E95331] transition-colors">
            {guide.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4 flex-1">
            {guide.excerpt}
          </p>
          <div className="flex items-center gap-1.5 text-[#E95331] text-sm font-semibold">
            Read Guide
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GuidesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return GUIDES;
    return GUIDES.filter((g) => g.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[var(--brand-cream)] dark:bg-[#0a1a13]">
      <SharedNavbar activePage="guides" />

      {/* Hero */}
      <section className="pt-16">
        <div className="hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-30" />
          <div className="absolute top-20 left-[10%] w-64 h-64 bg-[#6BBFAC]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-[15%] w-80 h-80 bg-[#E7B61B]/8 rounded-full blur-[100px]" />

          <div className="relative container mx-auto px-4 max-w-5xl py-12 sm:py-14 md:py-16 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-[#E7B61B] px-4 py-1.5 rounded-full text-sm font-semibold border border-white/10 mb-6">
                <BookOpen className="h-3.5 w-3.5" />
                TRAVEL GUIDES
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display text-white tracking-tight leading-tight mb-4">
                Your China{" "}
                <span className="text-gradient-brand">Knowledge Base</span>
              </h1>
              <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
                Everything you need to know before, during, and after your trip. From visa tips to street food secrets.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8 px-4 sticky top-16 z-40 bg-[var(--brand-cream)]/90 dark:bg-[#0a1a13]/90 backdrop-blur-md border-b border-[#E0C4BC]/20 dark:border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {GUIDE_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#083022] text-white shadow-md dark:bg-white dark:text-[#083022]"
                      : "bg-white dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guide Grid */}
      <section className="py-4 sm:py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filtered.map((guide, i) => (
              <GuideCard key={guide.slug} guide={guide} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-400 dark:text-slate-500">No guides found for this category.</p>
            </div>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-10 text-center"
          >
            <div className="bg-white dark:bg-[#0d2a1f] rounded-2xl border border-slate-100 dark:border-white/10 shadow-soft p-8 sm:p-10 max-w-2xl mx-auto">
              <div className="w-16 h-16 relative mx-auto mb-4">
                <Image
                  src="/brand/totos/foodie_toto.png"
                  alt="Toto reading"
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
              <h3 className="text-2xl font-display text-slate-900 dark:text-white mb-2">
                Got a question not covered here?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                toto knows China inside out. Ask anything — visa quirks, local customs, hidden gems, or how to say &quot;no spicy please&quot; in Mandarin.
              </p>
              <Button
                onClick={() => router.push(`/chat/temp-${Date.now()}`)}
                size="lg"
                className="h-12 px-6 bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-lg shadow-[#E95331]/15 rounded-2xl border-0 font-semibold"
              >
                Ask toto
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}
