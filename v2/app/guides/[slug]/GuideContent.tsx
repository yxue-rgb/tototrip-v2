"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useState } from "react";
import { motion } from "framer-motion";
import { type Guide } from "@/lib/guides-data";

function renderMarkdown(md: string): string {
  let html = md;

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-[#083022] dark:text-white mt-8 mb-3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-[#083022] dark:text-white mt-10 mb-4 pb-2 border-b border-[#E0C4BC]/20 dark:border-white/10">$1</h2>');
  html = html.replace(/^# (.+)$/gm, ""); // Remove h1 — we render title separately

  // Blockquotes
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote class="border-l-4 border-[#E95331]/40 bg-[#E95331]/5 dark:bg-[#E95331]/10 pl-4 pr-4 py-3 my-4 rounded-r-lg text-sm text-slate-600 dark:text-slate-300">$1</blockquote>'
  );

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-[#083022] dark:text-white">$1</strong>');

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-[#E95331] hover:text-[#d44a2b] underline underline-offset-2 transition-colors">$1</a>'
  );

  // Tables
  html = html.replace(
    /\n\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/g,
    (_, headerRow: string, bodyRows: string) => {
      const headers = headerRow.split("|").map((h: string) => h.trim()).filter(Boolean);
      const rows = bodyRows.trim().split("\n").map((row: string) =>
        row.split("|").map((c: string) => c.trim()).filter(Boolean)
      );
      return `<div class="overflow-x-auto my-6"><table class="w-full text-sm border-collapse"><thead><tr>${headers
        .map((h: string) => `<th class="text-left py-2 px-3 bg-[#083022]/5 dark:bg-white/5 font-semibold text-[#083022] dark:text-white border-b border-[#E0C4BC]/20 dark:border-white/10">${h}</th>`)
        .join("")}</tr></thead><tbody>${rows
        .map(
          (row: string[]) =>
            `<tr class="border-b border-[#E0C4BC]/10 dark:border-white/5">${row
              .map((c: string) => `<td class="py-2 px-3 text-slate-600 dark:text-slate-300">${c}</td>`)
              .join("")}</tr>`
        )
        .join("")}</tbody></table></div>`;
    }
  );

  // Unordered lists
  html = html.replace(
    /((?:^- .+\n?)+)/gm,
    (match) => {
      const items = match.trim().split("\n").map((line) => {
        const content = line.replace(/^- /, "");
        return `<li class="flex items-start gap-2 py-1"><span class="text-[#E95331] mt-1.5 flex-shrink-0">•</span><span>${content}</span></li>`;
      });
      return `<ul class="space-y-0.5 my-4 text-sm text-slate-600 dark:text-slate-300">${items.join("")}</ul>`;
    }
  );

  // Numbered lists
  html = html.replace(
    /((?:^\d+\. .+\n?)+)/gm,
    (match) => {
      const items = match.trim().split("\n").map((line, idx) => {
        const content = line.replace(/^\d+\. /, "");
        return `<li class="flex items-start gap-2.5 py-1"><span class="flex-shrink-0 w-5 h-5 bg-[#E95331]/10 text-[#E95331] rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">${idx + 1}</span><span>${content}</span></li>`;
      });
      return `<ol class="space-y-1 my-4 text-sm text-slate-600 dark:text-slate-300">${items.join("")}</ol>`;
    }
  );

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-8 border-[#E0C4BC]/20 dark:border-white/10" />');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#083022]/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-[#E95331] text-xs font-mono">$1</code>');

  // Paragraphs
  html = html.replace(/^(?!<[a-z])((?!^\s*$).+)$/gm, (match) => {
    if (match.startsWith("<")) return match;
    return `<p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">${match}</p>`;
  });

  // Emojis in check/cross
  html = html.replace(/✅/g, '<span class="text-green-500">✅</span>');
  html = html.replace(/❌/g, '<span class="text-red-500">❌</span>');

  return html;
}

export function GuideContent({ guide }: { guide: Guide }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const categoryLabels: Record<string, string> = {
    "getting-started": "Getting Started",
    destinations: "Destinations",
    tips: "Tips",
  };

  return (
    <div className="min-h-screen bg-[var(--brand-cream)] dark:bg-[#0a1a13]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#E0C4BC]/30 dark:border-white/10">
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
            <a href="/" className="px-3 py-2 text-sm font-medium text-[#083022]/70 dark:text-slate-400 hover:text-[#083022] dark:hover:text-white rounded-lg hover:bg-[#E0C4BC]/20 dark:hover:bg-white/10 transition-all">
              Home
            </a>
            <a href="/guides" className="px-3 py-2 text-sm font-medium text-[#E95331] bg-[#E95331]/10 rounded-lg">
              Guides
            </a>
            <a href="/inspiration" className="px-3 py-2 text-sm font-medium text-[#083022]/70 dark:text-slate-400 hover:text-[#083022] dark:hover:text-white rounded-lg hover:bg-[#E0C4BC]/20 dark:hover:bg-white/10 transition-all">
              Inspiration
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16">
        <div className="relative h-64 md:h-80 overflow-hidden">
          <Image
            src={guide.coverImage}
            alt={guide.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#083022]/90 via-[#083022]/50 to-[#083022]/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 max-w-4xl pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => router.push("/guides")}
                    className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    All Guides
                  </button>
                  <span className="text-white/30">·</span>
                  <span className="text-[#6BBFAC] text-sm font-medium">
                    {categoryLabels[guide.category]}
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-display text-white tracking-tight leading-tight mb-3">
                  {guide.title}
                </h1>
                <div className="flex items-center gap-4 text-white/60 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {guide.readTime} min read
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    Travel Guide
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 md:py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-[#0d2a1f] rounded-2xl border border-slate-100 dark:border-white/10 shadow-soft p-6 md:p-10"
          >
            <div
              className="guide-content"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(guide.content) }}
            />
          </motion.div>

          {/* Bottom navigation */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/guides")}
              className="border-[#E0C4BC] dark:border-white/15 dark:text-slate-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Guides
            </Button>
            <Button
              onClick={() => router.push(`/chat/temp-${Date.now()}`)}
              className="bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-md shadow-[#E95331]/15 border-0"
            >
              Ask toto a Question
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
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
            &copy; {new Date().getFullYear()} toto. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
