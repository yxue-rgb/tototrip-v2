"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/contexts/I18nContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { SharedNavbar } from "@/components/SharedNavbar";
import { SharedFooter } from "@/components/SharedFooter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  FileText,
  Smartphone,
  Train,
  UtensilsCrossed,
  Languages,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  User,
  Plane,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Toolkit Section Config ─── */
const TOOLKIT_SECTIONS = [
  "payment",
  "visa",
  "internet",
  "transport",
  "food",
  "language",
] as const;

type ToolkitSection = (typeof TOOLKIT_SECTIONS)[number];

const SECTION_CONFIG: Record<
  ToolkitSection,
  {
    icon: typeof CreditCard;
    emoji: string;
    color: string;
    bg: string;
    darkBg: string;
    border: string;
    gradient: string;
  }
> = {
  payment: {
    icon: CreditCard,
    emoji: "💳",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    darkBg: "dark:bg-emerald-500/10",
    border: "border-emerald-100 dark:border-emerald-500/20",
    gradient: "from-emerald-500 to-teal-600",
  },
  visa: {
    icon: FileText,
    emoji: "📋",
    color: "text-blue-600",
    bg: "bg-blue-50",
    darkBg: "dark:bg-blue-500/10",
    border: "border-blue-100 dark:border-blue-500/20",
    gradient: "from-blue-500 to-indigo-600",
  },
  internet: {
    icon: Smartphone,
    emoji: "📱",
    color: "text-violet-600",
    bg: "bg-violet-50",
    darkBg: "dark:bg-violet-500/10",
    border: "border-violet-100 dark:border-violet-500/20",
    gradient: "from-violet-500 to-purple-600",
  },
  transport: {
    icon: Train,
    emoji: "🚄",
    color: "text-orange-600",
    bg: "bg-orange-50",
    darkBg: "dark:bg-orange-500/10",
    border: "border-orange-100 dark:border-orange-500/20",
    gradient: "from-orange-500 to-red-500",
  },
  food: {
    icon: UtensilsCrossed,
    emoji: "🍜",
    color: "text-rose-600",
    bg: "bg-rose-50",
    darkBg: "dark:bg-rose-500/10",
    border: "border-rose-100 dark:border-rose-500/20",
    gradient: "from-rose-500 to-pink-600",
  },
  language: {
    icon: Languages,
    emoji: "🗣️",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    darkBg: "dark:bg-cyan-500/10",
    border: "border-cyan-100 dark:border-cyan-500/20",
    gradient: "from-cyan-500 to-blue-600",
  },
};

/* ─── Tip Box Component ─── */
function TipBox({
  type,
  children,
}: {
  type: "tip" | "warning" | "info";
  children: React.ReactNode;
}) {
  const config = {
    tip: {
      icon: Lightbulb,
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-200 dark:border-amber-500/20",
      iconColor: "text-amber-500",
      textColor: "text-amber-800 dark:text-amber-200",
    },
    warning: {
      icon: AlertCircle,
      bg: "bg-red-50 dark:bg-red-500/10",
      border: "border-red-200 dark:border-red-500/20",
      iconColor: "text-red-500",
      textColor: "text-red-800 dark:text-red-200",
    },
    info: {
      icon: CheckCircle2,
      bg: "bg-blue-50 dark:bg-blue-500/10",
      border: "border-blue-200 dark:border-blue-500/20",
      iconColor: "text-blue-500",
      textColor: "text-blue-800 dark:text-blue-200",
    },
  };
  const c = config[type];
  const Icon = c.icon;

  return (
    <div
      className={`flex gap-3 p-4 rounded-xl border ${c.bg} ${c.border} mt-4`}
    >
      <Icon className={`h-5 w-5 ${c.iconColor} flex-shrink-0 mt-0.5`} />
      <div className={`text-sm leading-relaxed ${c.textColor}`}>{children}</div>
    </div>
  );
}

/* ─── Step List Component ─── */
function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3 mt-4">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#E95331] to-[#E7B61B] text-white text-xs font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ─── Section Content Components ─── */

function PaymentContent({ t }: { t: (key: string) => string }) {
  return (
    <div className="space-y-8">
      {/* WeChat Pay / Alipay */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">📲</span> {t("toolkit.payment.mobilePay.title")}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          {t("toolkit.payment.mobilePay.desc")}
        </p>
        <StepList
          steps={[
            t("toolkit.payment.mobilePay.step1"),
            t("toolkit.payment.mobilePay.step2"),
            t("toolkit.payment.mobilePay.step3"),
            t("toolkit.payment.mobilePay.step4"),
            t("toolkit.payment.mobilePay.step5"),
          ]}
        />
        <TipBox type="info">
          {t("toolkit.payment.mobilePay.tip")}
        </TipBox>
      </div>

      {/* Backup Options */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">💵</span> {t("toolkit.payment.backup.title")}
        </h4>
        <ul className="space-y-2 mt-3">
          {["cash", "visa", "atm"].map((key) => (
            <li key={key} className="flex gap-2 items-start">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {t(`toolkit.payment.backup.${key}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Street Food Tips */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">🏪</span> {t("toolkit.payment.street.title")}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("toolkit.payment.street.desc")}
        </p>
        <TipBox type="tip">
          {t("toolkit.payment.street.tip")}
        </TipBox>
      </div>
    </div>
  );
}

function VisaContent({ t }: { t: (key: string) => string }) {
  return (
    <div className="space-y-8">
      {/* 144-hour Transit */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">🛂</span> {t("toolkit.visa.transit.title")}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          {t("toolkit.visa.transit.desc")}
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-2">
              {t("toolkit.visa.transit.portsLabel")}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t("toolkit.visa.transit.ports")}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-2">
              {t("toolkit.visa.transit.requirementsLabel")}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t("toolkit.visa.transit.requirements")}
            </p>
          </div>
        </div>
      </div>

      {/* Visa-Free Countries */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">🌍</span> {t("toolkit.visa.visaFree.title")}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("toolkit.visa.visaFree.desc")}
        </p>
        <TipBox type="info">
          {t("toolkit.visa.visaFree.tip")}
        </TipBox>
      </div>

      {/* After Arrival */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">📝</span> {t("toolkit.visa.arrival.title")}
        </h4>
        <StepList
          steps={[
            t("toolkit.visa.arrival.step1"),
            t("toolkit.visa.arrival.step2"),
            t("toolkit.visa.arrival.step3"),
          ]}
        />
        <TipBox type="warning">
          {t("toolkit.visa.arrival.warning")}
        </TipBox>
      </div>
    </div>
  );
}

function InternetContent({ t }: { t: (key: string) => string }) {
  return (
    <div className="space-y-8">
      {/* eSIM */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">📡</span> {t("toolkit.internet.esim.title")}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          {t("toolkit.internet.esim.desc")}
        </p>
        <ul className="space-y-2 mt-3">
          {["airalo", "holafly", "nomad"].map((key) => (
            <li key={key} className="flex gap-2 items-start">
              <CheckCircle2 className="h-4 w-4 text-violet-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {t(`toolkit.internet.esim.${key}`)}
              </span>
            </li>
          ))}
        </ul>
        <TipBox type="tip">
          {t("toolkit.internet.esim.tip")}
        </TipBox>
      </div>

      {/* VPN */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">🔐</span> {t("toolkit.internet.vpn.title")}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          {t("toolkit.internet.vpn.desc")}
        </p>
        <ul className="space-y-2 mt-3">
          {["rec1", "rec2", "rec3"].map((key) => (
            <li key={key} className="flex gap-2 items-start">
              <CheckCircle2 className="h-4 w-4 text-violet-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {t(`toolkit.internet.vpn.${key}`)}
              </span>
            </li>
          ))}
        </ul>
        <TipBox type="warning">
          {t("toolkit.internet.vpn.warning")}
        </TipBox>
      </div>

      {/* Airport WiFi / SIM */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">🛫</span> {t("toolkit.internet.airport.title")}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("toolkit.internet.airport.desc")}
        </p>
      </div>
    </div>
  );
}

function TransportContent({ t }: { t: (key: string) => string }) {
  return (
    <div className="space-y-8">
      {/* High-Speed Rail */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">🚄</span> {t("toolkit.transport.rail.title")}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          {t("toolkit.transport.rail.desc")}
        </p>
        <StepList
          steps={[
            t("toolkit.transport.rail.step1"),
            t("toolkit.transport.rail.step2"),
            t("toolkit.transport.rail.step3"),
          ]}
        />
        <TipBox type="tip">
          {t("toolkit.transport.rail.tip")}
        </TipBox>
      </div>

      {/* Metro */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">🚇</span> {t("toolkit.transport.metro.title")}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("toolkit.transport.metro.desc")}
        </p>
        <ul className="space-y-2 mt-3">
          {["alipay", "card", "ticket"].map((key) => (
            <li key={key} className="flex gap-2 items-start">
              <CheckCircle2 className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {t(`toolkit.transport.metro.${key}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Ride-Hailing */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">🚕</span> {t("toolkit.transport.taxi.title")}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("toolkit.transport.taxi.desc")}
        </p>
        <TipBox type="tip">
          {t("toolkit.transport.taxi.tip")}
        </TipBox>
      </div>

      {/* Airport Transfer */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">✈️</span> {t("toolkit.transport.airport.title")}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("toolkit.transport.airport.desc")}
        </p>
      </div>
    </div>
  );
}

function FoodContent({ t }: { t: (key: string) => string }) {
  return (
    <div className="space-y-8">
      {/* Finding Restaurants */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">🔍</span> {t("toolkit.food.find.title")}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("toolkit.food.find.desc")}
        </p>
        <TipBox type="tip">
          {t("toolkit.food.find.tip")}
        </TipBox>
      </div>

      {/* QR Code Ordering */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">📱</span> {t("toolkit.food.order.title")}
        </h4>
        <StepList
          steps={[
            t("toolkit.food.order.step1"),
            t("toolkit.food.order.step2"),
            t("toolkit.food.order.step3"),
            t("toolkit.food.order.step4"),
          ]}
        />
      </div>

      {/* Allergies & Dietary */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">⚠️</span> {t("toolkit.food.allergy.title")}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          {t("toolkit.food.allergy.desc")}
        </p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {["noGluten", "noPeanut", "vegetarian", "halal"].map((key) => (
            <div
              key={key}
              className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 text-center"
            >
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {t(`toolkit.food.allergy.${key}`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Must-Try Foods */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">🌟</span> {t("toolkit.food.mustTry.title")}
        </h4>
        <ul className="space-y-2 mt-3">
          {["item1", "item2", "item3", "item4", "item5"].map((key) => (
            <li key={key} className="flex gap-2 items-start">
              <span className="text-base flex-shrink-0">🥢</span>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {t(`toolkit.food.mustTry.${key}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LanguageContent({ t }: { t: (key: string) => string }) {
  const phrases = [
    "hello", "thanks", "sorry", "howMuch", "where", "dontWant",
    "help", "check", "noSpicy", "delicious", "toilet", "tooExpensive",
  ] as const;

  return (
    <div className="space-y-8">
      {/* Essential Phrases */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">💬</span> {t("toolkit.language.phrases.title")}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          {t("toolkit.language.phrases.desc")}
        </p>
        <div className="grid sm:grid-cols-2 gap-2 mt-4">
          {phrases.map((key) => (
            <div
              key={key}
              className="p-3 rounded-xl bg-cyan-50/50 dark:bg-cyan-500/5 border border-cyan-100 dark:border-cyan-500/10"
            >
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {t(`toolkit.language.phrases.${key}.cn`)}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {t(`toolkit.language.phrases.${key}.pinyin`)}
              </p>
              <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-0.5">
                {t(`toolkit.language.phrases.${key}.en`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Translation Apps */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">📲</span> {t("toolkit.language.apps.title")}
        </h4>
        <ul className="space-y-2 mt-3">
          {["app1", "app2", "app3"].map((key) => (
            <li key={key} className="flex gap-2 items-start">
              <CheckCircle2 className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {t(`toolkit.language.apps.${key}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Common Signs */}
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span className="text-lg">🪧</span> {t("toolkit.language.signs.title")}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
          {["exit", "entrance", "restroom", "noSmoking", "subway", "danger"].map((key) => (
            <div
              key={key}
              className="p-3 rounded-xl bg-cyan-50/50 dark:bg-cyan-500/5 border border-cyan-100 dark:border-cyan-500/10 text-center"
            >
              <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                {t(`toolkit.language.signs.${key}.cn`)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {t(`toolkit.language.signs.${key}.en`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Accordion Item ─── */
function ToolkitAccordionItem({
  section,
  isOpen,
  onToggle,
  t,
}: {
  section: ToolkitSection;
  isOpen: boolean;
  onToggle: () => void;
  t: (key: string) => string;
}) {
  const config = SECTION_CONFIG[section];
  const Icon = config.icon;

  const ContentComponent = {
    payment: PaymentContent,
    visa: VisaContent,
    internet: InternetContent,
    transport: TransportContent,
    food: FoodContent,
    language: LanguageContent,
  }[section];

  return (
    <motion.div
      layout
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? `${config.border} shadow-elevated`
          : "border-slate-100 dark:border-white/10 shadow-soft hover:shadow-elevated"
      }`}
    >
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-4 p-5 md:p-6 text-left transition-colors duration-200 ${
          isOpen
            ? "bg-white dark:bg-[#0d2a1f]"
            : "bg-white dark:bg-[#0d2a1f] hover:bg-slate-50/50 dark:hover:bg-[#252640]"
        }`}
      >
        <div
          className={`w-12 h-12 rounded-xl ${config.bg} ${config.darkBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "scale-110" : ""
          }`}
        >
          <Icon className={`h-6 w-6 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {config.emoji} {t(`toolkit.sections.${section}.title`)}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {t(`toolkit.sections.${section}.summary`)}
          </p>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="px-5 md:px-6 pb-6 pt-2 border-t border-slate-100 dark:border-white/10">
              <ContentComponent t={t} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Toolkit Page ─── */
export default function ToolkitPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [openSections, setOpenSections] = useState<Set<ToolkitSection>>(
    new Set()
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSection = (section: ToolkitSection) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenSections(new Set(TOOLKIT_SECTIONS));
  };

  const collapseAll = () => {
    setOpenSections(new Set());
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a1a13]">
      <SharedNavbar activePage="toolkit" />

      {/* ─── Hero Section ─── */}
      <section className="relative pt-16 overflow-hidden z-0">
        <div className="hero-gradient relative">
          <div className="absolute inset-0 bg-dot-pattern opacity-30" />
          <div className="absolute top-20 left-[10%] w-64 h-64 bg-[#E95331]/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-[15%] w-80 h-80 bg-[#E7B61B]/8 rounded-full blur-[100px]" />

          <div className="relative container mx-auto px-4 max-w-4xl pt-16 pb-12 md:pt-20 md:pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <span className="inline-flex items-center gap-1.5 bg-white/10 text-[#E7B61B] px-4 py-1.5 rounded-full text-sm font-semibold border border-white/10 backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("toolkit.badge")}
                </span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display tracking-tight leading-[1.1] mb-5">
                <span className="text-white">{t("toolkit.heroTitle")}</span>
                <br />
                <span className="text-gradient-brand">
                  {t("toolkit.heroHighlight")}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                {t("toolkit.heroSubtitle")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Toolkit Content ─── */}
      <section className="relative z-0 py-10 md:py-16 px-4 bg-[var(--brand-cream)] dark:bg-[#0a1a13]">
        <div className="container mx-auto max-w-3xl">
          {/* Expand/Collapse controls */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("toolkit.clickToExpand")}
            </p>
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="text-xs font-medium text-[#E95331] hover:text-[#d44a2b] transition-colors"
              >
                {t("toolkit.expandAll")}
              </button>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <button
                onClick={collapseAll}
                className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                {t("toolkit.collapseAll")}
              </button>
            </div>
          </div>

          {/* Accordion */}
          <div className="space-y-4">
            {TOOLKIT_SECTIONS.map((section) => (
              <ToolkitAccordionItem
                key={section}
                section={section}
                isOpen={openSections.has(section)}
                onToggle={() => toggleSection(section)}
                t={t}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-16 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E95331]/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#E7B61B]/15 rounded-full blur-[120px]" />

        <div className="relative container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display text-white mb-4 tracking-tight">
              {t("toolkit.ctaTitle")}
            </h2>
            <p className="text-lg text-white/50 mb-8 max-w-xl mx-auto leading-relaxed">
              {t("toolkit.ctaSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => router.push("/")}
                size="lg"
                className="h-13 px-8 bg-gradient-to-r from-[#E95331] to-[#E7B61B] hover:from-[#d63c34] hover:to-[#c69845] text-white shadow-xl shadow-red-500/20 rounded-2xl border-0 text-base font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/30 hover:-translate-y-0.5"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {t("toolkit.ctaChat")}
              </Button>
              <Button
                onClick={() => router.push("/inspiration")}
                size="lg"
                variant="outline"
                className="h-13 px-8 text-white border-white/20 hover:bg-white/10 rounded-2xl text-base font-semibold transition-all duration-300"
              >
                {t("toolkit.ctaInspiration")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <SharedFooter />
    </div>
  );
}
