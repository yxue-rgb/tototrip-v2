"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Heart, Globe, Sparkles, MessageCircle, Map, Shield } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { SharedFooter } from "@/components/SharedFooter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const TOTO_IMAGES = [
  { src: "/brand/totos/plain_toto.png", alt: "Toto", label: "Explorer Toto" },
  { src: "/brand/totos/foodie_toto.png", alt: "Foodie Toto", label: "Foodie Toto" },
  { src: "/brand/totos/nature_toto.png", alt: "Nature Toto", label: "Nature Toto" },
  { src: "/brand/totos/family_toto.png", alt: "Family Toto", label: "Family Toto" },
  { src: "/brand/totos/party_toto.png", alt: "Party Toto", label: "Party Toto" },
  { src: "/brand/totos/pool_toto.png", alt: "Pool Toto", label: "Pool Toto" },
];

const VALUES = [
  { icon: Globe, color: "text-[#6BBFAC]", bg: "bg-[#6BBFAC]/10" },
  { icon: MessageCircle, color: "text-[#E95331]", bg: "bg-[#E95331]/10" },
  { icon: Shield, color: "text-[#99B7CF]", bg: "bg-[#99B7CF]/10" },
  { icon: Heart, color: "text-[#C999C5]", bg: "bg-[#C999C5]/10" },
] as const;

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(delay, 0.4), ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const c = locale === "zh" ? zh : en;

  return (
    <div className="min-h-screen bg-[#FBF7F4] dark:bg-[#071e16]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#FBF7F4]/80 dark:bg-[#071e16]/80 border-b border-[#E0C4BC]/20 dark:border-white/5">
        <div className="container mx-auto max-w-5xl flex items-center justify-between px-4 h-14">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#083022]/60 dark:text-white/60 hover:text-[#083022] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <Image
              src="/brand/toto_logo_plain.png"
              alt="toto"
              width={60}
              height={20}
              className="h-5 w-auto dark:hidden"
            />
            <Image
              src="/brand/toto_logo_plain_light.png"
              alt="toto"
              width={60}
              height={20}
              className="h-5 w-auto hidden dark:block"
            />
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#083022]/5 to-transparent dark:from-[#6BBFAC]/5 dark:to-transparent" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#6BBFAC]/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#E7B61B]/10 rounded-full blur-[120px]" />

          <div className="relative container mx-auto max-w-4xl text-center">
            <FadeUp>
              <p className="font-subtitle text-[#6BBFAC] tracking-widest text-xs uppercase mb-4">
                {c.hero.badge}
              </p>
              <h1 className="font-display text-5xl md:text-7xl text-[#083022] dark:text-white mb-6">
                {c.hero.title}
              </h1>
              <p className="text-lg md:text-xl text-[#083022]/60 dark:text-white/50 max-w-2xl mx-auto leading-relaxed">
                {c.hero.subtitle}
              </p>
            </FadeUp>
          </div>
        </section>

        {/* Meet Toto */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <FadeUp>
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#083022] dark:text-white mb-4">
                    {c.meet.title}
                  </h2>
                  <div className="space-y-4 text-[#083022]/70 dark:text-white/60 leading-relaxed">
                    {c.meet.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <Image
                      src="/brand/totos/plain_toto.png"
                      alt="Toto the dog"
                      fill
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 md:py-16 px-4 bg-[#083022]/[0.02] dark:bg-white/[0.02]">
          <div className="container mx-auto max-w-4xl">
            <FadeUp>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-[#083022] dark:text-white mb-3">
                  {c.values.title}
                </h2>
                <p className="text-[#083022]/50 dark:text-white/40 max-w-xl mx-auto">
                  {c.values.subtitle}
                </p>
              </div>
            </FadeUp>
            <div className="grid sm:grid-cols-2 gap-5">
              {c.values.items.map((item, i) => {
                const V = VALUES[i];
                return (
                  <FadeUp key={i} delay={i * 0.08}>
                    <div className="p-6 bg-white dark:bg-[#0d2a1f] rounded-2xl border border-[#E0C4BC]/20 dark:border-white/5 hover:border-[#6BBFAC]/30 dark:hover:border-[#6BBFAC]/20 transition-colors">
                      <div className={`w-10 h-10 ${V.bg} rounded-xl flex items-center justify-center mb-4`}>
                        <V.icon className={`h-5 w-5 ${V.color}`} />
                      </div>
                      <h3 className="font-semibold text-[#083022] dark:text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-[#083022]/60 dark:text-white/50 leading-relaxed">{item.desc}</p>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* Toto Gallery */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <FadeUp>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-[#083022] dark:text-white mb-3">
                  {c.gallery.title}
                </h2>
                <p className="text-[#083022]/50 dark:text-white/40">
                  {c.gallery.subtitle}
                </p>
              </div>
            </FadeUp>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {TOTO_IMAGES.map((toto, i) => (
                <FadeUp key={i} delay={i * 0.06}>
                  <div className="group flex flex-col items-center">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 mb-2 group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={toto.src}
                        alt={toto.alt}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-xs text-[#083022]/40 dark:text-white/30 font-medium text-center">
                      {toto.label}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-12 md:py-16 px-4 bg-[#083022]/[0.02] dark:bg-white/[0.02]">
          <div className="container mx-auto max-w-3xl text-center">
            <FadeUp>
              <Sparkles className="h-8 w-8 text-[#E7B61B] mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#083022] dark:text-white mb-4">
                {c.mission.title}
              </h2>
              <p className="text-lg text-[#083022]/60 dark:text-white/50 leading-relaxed max-w-2xl mx-auto">
                {c.mission.body}
              </p>
            </FadeUp>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 bg-dot-pattern opacity-20" />
          <div className="relative container mx-auto max-w-3xl text-center">
            <FadeUp>
              <h2 className="font-display text-3xl md:text-5xl text-white mb-6">
                {c.cta.title}
              </h2>
              <p className="text-lg text-white/50 mb-8 max-w-xl mx-auto">
                {c.cta.subtitle}
              </p>
              <Button
                onClick={() => router.push("/chat/new")}
                size="lg"
                className="h-14 px-8 bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-xl shadow-[#E95331]/20 rounded-2xl border-0 text-base font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-[#E95331]/30 hover:-translate-y-0.5"
              >
                {c.cta.button}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </FadeUp>
          </div>
        </section>
      </main>

      <SharedFooter />
    </div>
  );
}

/* ─── Content ─── */

const en = {
  hero: {
    badge: "Meet Toto",
    title: "Your Travel Buddy for China",
    subtitle: "toto is an AI-powered travel companion that helps you navigate China with confidence — from setting up payments to finding the best street food stalls.",
  },
  meet: {
    title: "Who is Toto?",
    paragraphs: [
      "Toto is a friendly Shiba Inu who's been everywhere in China — from the hutongs of Beijing to the neon skyline of Shanghai, from the spicy hotpot joints of Chengdu to the karst mountains of Guilin.",
      "We built toto because we know traveling to China can feel overwhelming. Different payment systems, a unique internet landscape, a language barrier, and a culture that's incredibly rich but hard to decode from the outside.",
      "So we created an AI companion that actually understands the practical side of China travel — not just what to see, but how to get around, how to pay, what to eat, and how to make the most of every moment.",
    ],
  },
  values: {
    title: "What We Believe",
    subtitle: "The principles that guide everything we build.",
    items: [
      { title: "Travel Should Be Accessible", desc: "China is one of the most fascinating countries on earth. Language and logistics shouldn't be a barrier to experiencing it." },
      { title: "Real Answers, Not Generic Tips", desc: "Our AI doesn't recite guidebook clichés. It gives you practical, specific advice based on what travelers actually need." },
      { title: "Privacy First", desc: "We don't track you, we don't sell your data, and we don't use advertising cookies. Your trip planning stays between you and Toto." },
      { title: "Built with Love", desc: "toto is made by people who genuinely love China and want to share it with the world. Every feature comes from real travel experience." },
    ],
  },
  gallery: {
    title: "The Many Faces of Toto",
    subtitle: "Different trips, same trusty companion.",
  },
  mission: {
    title: "Our Mission",
    body: "We're on a mission to make China the most accessible travel destination in the world. Whether it's your first trip or your fiftieth, toto helps you travel smarter, eat better, and experience more — all while keeping that light-hearted spirit of adventure alive.",
  },
  cta: {
    title: "Ready to Explore?",
    subtitle: "Start planning your trip to China with toto. It's free, friendly, and surprisingly useful.",
    button: "Start Planning Your Trip",
  },
};

const zh = {
  hero: {
    badge: "认识 Toto",
    title: "你的中国旅行伙伴",
    subtitle: "toto 是一个 AI 驱动的旅行伙伴，帮助你自信地探索中国 — 从设置支付到找到最好的街头美食摊位。",
  },
  meet: {
    title: "Toto 是谁？",
    paragraphs: [
      "Toto 是一只友好的柴犬，它去过中国的每一个角落 — 从北京的胡同到上海的霓虹天际线，从成都的麻辣火锅店到桂林的喀斯特山水。",
      "我们创建 toto 是因为我们知道到中国旅行可能让人感到不知所措。不同的支付系统、独特的互联网环境、语言障碍，以及一种非常丰富但从外部难以理解的文化。",
      "所以我们创建了一个真正理解中国旅行实际需求的 AI 伙伴 — 不仅告诉你看什么，还告诉你怎么出行、怎么支付、吃什么，以及如何充分利用每一刻。",
    ],
  },
  values: {
    title: "我们的信念",
    subtitle: "指导我们一切的原则。",
    items: [
      { title: "旅行应该是无障碍的", desc: "中国是地球上最迷人的国家之一。语言和物流不应该成为体验它的障碍。" },
      { title: "真实的答案，而非泛泛之谈", desc: "我们的 AI 不会背诵旅行指南的陈词滥调。它根据旅行者的实际需求给出实用、具体的建议。" },
      { title: "隐私优先", desc: "我们不追踪你，不出售你的数据，不使用广告 Cookie。你的旅行规划只在你和 Toto 之间。" },
      { title: "用心打造", desc: "toto 由真正热爱中国并想与世界分享的人打造。每一个功能都来自真实的旅行经验。" },
    ],
  },
  gallery: {
    title: "Toto 的多面孔",
    subtitle: "不同的旅行，同一个可靠伙伴。",
  },
  mission: {
    title: "我们的使命",
    body: "我们的使命是让中国成为世界上最容易到达的旅行目的地。无论是你的第一次还是第五十次旅行，toto 都能帮助你更智慧地旅行、更好地品尝美食、体验更多 — 同时保持那份轻松愉快的冒险精神。",
  },
  cta: {
    title: "准备好探索了吗？",
    subtitle: "用 toto 开始规划你的中国之旅吧。免费、友好、而且出乎意料地实用。",
    button: "开始规划旅行",
  },
};
