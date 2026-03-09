"use client";

import { motion } from "framer-motion";
import { MapPin, UtensilsCrossed, TrainFront, CreditCard, Sparkles, Shield, Cloud, Coins, Globe, Calendar, ArrowRight } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import Image from "next/image";

interface WelcomeOnboardingProps {
  onQuickAction: (message: string) => void;
}

const quickActions = [
  { key: "quickActionBeijing", emoji: "🗺️", icon: MapPin },
  { key: "quickActionFood", emoji: "🍜", icon: UtensilsCrossed },
  { key: "quickActionTrain", emoji: "🚄", icon: TrainFront },
  { key: "quickActionWechat", emoji: "💳", icon: CreditCard },
  { key: "quickActionVisa", emoji: "🛂", icon: Globe },
  { key: "quickActionWeather", emoji: "🌤️", icon: Cloud },
  { key: "quickActionCurrency", emoji: "💰", icon: Coins },
  { key: "quickActionSafety", emoji: "🛡️", icon: Shield },
] as const;

/* Popular trip templates (subset) */
const POPULAR_TRIPS = [
  { title: "Beijing 3-Day Classic", cities: "Beijing", days: 3, emoji: "🏛️", query: "Plan a 3-day classic trip to Beijing with Great Wall and Forbidden City" },
  { title: "Chengdu Food Paradise", cities: "Chengdu", days: 4, emoji: "🍜", query: "Plan a 4-day food-focused trip to Chengdu with pandas and hotpot" },
  { title: "First Timer's China", cities: "Beijing → Xi'an → Shanghai", days: 7, emoji: "🌏", query: "Plan a 7-day first-timer trip to China covering Beijing, Xi'an, and Shanghai" },
  { title: "Yunnan Nature Trek", cities: "Kunming → Dali → Lijiang", days: 6, emoji: "🌿", query: "Plan a 6-day nature trek through Yunnan visiting Kunming, Dali, Lijiang and Shangri-La" },
];

export function WelcomeOnboarding({ onQuickAction }: WelcomeOnboardingProps) {
  const { t } = useI18n();

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-6 bg-gray-50 dark:bg-[#0a1a13]">
      <div className="max-w-2xl w-full space-y-5">
        {/* Welcome Card — compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center space-y-3"
        >
          {/* Toto mascot */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto w-16 h-16 relative"
          >
            <Image
              src="/brand/totos/plain_toto.png"
              alt="Toto"
              fill
              className="object-contain"
              sizes="64px"
            />
          </motion.div>

          {/* Welcome Message — more compact */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto text-left bg-white dark:bg-[#0d2a1f] rounded-2xl p-4 border border-gray-200 dark:border-white/10 shadow-sm"
          >
            <p className="mb-2 font-medium text-gray-900 dark:text-white text-base">
              Woof! I&apos;m Toto, your China travel buddy! 🐕
            </p>
            <p className="text-gray-500 dark:text-slate-400 text-sm">
              I know all the secrets — from setting up WeChat Pay to finding the best street food.
              Tell me where you&apos;re headed and I&apos;ll plan everything! 🐾
            </p>
          </motion.div>
        </motion.div>

        {/* Quick Action Buttons — 8 actions in a 2x4 grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <Sparkles className="h-3 w-3 text-amber-400/50" />
            <span className="text-[11px] text-gray-400 dark:text-slate-600 font-medium uppercase tracking-wider">
              Quick Actions
            </span>
            <Sparkles className="h-3 w-3 text-amber-400/50" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.35 + index * 0.04 }}
                onClick={() => onQuickAction(t(`chat.welcome.${action.key}`))}
                className="group flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2a1f] hover:border-[#1a4a3a]/30 dark:hover:border-[#6BBFAC]/30 hover:bg-[#1a4a3a]/5 dark:hover:bg-[#6BBFAC]/5 hover:shadow-md transition-all duration-200 text-center"
              >
                <span className="text-xl">{action.emoji}</span>
                <span className="text-[11px] font-medium text-gray-600 dark:text-slate-400 group-hover:text-[#1a4a3a] dark:group-hover:text-[#6BBFAC] transition-colors leading-tight">
                  {t(`chat.welcome.${action.key}`)}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Popular Trips */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <Calendar className="h-3 w-3 text-[#E95331]/50" />
            <span className="text-[11px] text-gray-400 dark:text-slate-600 font-medium uppercase tracking-wider">
              Popular Trips
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {POPULAR_TRIPS.map((trip, index) => (
              <motion.button
                key={trip.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.55 + index * 0.04 }}
                onClick={() => onQuickAction(trip.query)}
                className="group flex items-center gap-3 px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2a1f] hover:border-[#E95331]/30 dark:hover:border-[#E95331]/30 hover:bg-[#E95331]/5 dark:hover:bg-[#E95331]/5 hover:shadow-md transition-all duration-200 text-left"
              >
                <span className="text-2xl flex-shrink-0">{trip.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 group-hover:text-[#E95331] transition-colors truncate">
                    {trip.title}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 truncate">
                    {trip.cities} · {trip.days} days
                  </p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-gray-300 dark:text-slate-600 group-hover:text-[#E95331] transition-colors flex-shrink-0" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Guiding Questions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {(["hintWhere", "hintDays", "hintInterest"] as const).map((hintKey, index) => (
            <motion.span
              key={hintKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.75 + index * 0.08 }}
              className="text-[11px] text-gray-400 dark:text-slate-600 italic bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-full"
            >
              &ldquo;{t(`chat.welcome.${hintKey}`)}&rdquo;
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
