"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles, Plane, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

const STRIPE_LINKS: Record<string, string | undefined> = {
  trip: process.env.NEXT_PUBLIC_STRIPE_LINK_TRIP_PASS,
  pro: process.env.NEXT_PUBLIC_STRIPE_LINK_PRO,
};

interface PricingSectionProps {
  /** compact = homepage preview; full = /pricing page */
  compact?: boolean;
}

export function PricingSection({ compact = false }: PricingSectionProps) {
  const router = useRouter();

  const tiers = [
    {
      id: "free",
      icon: Sparkles,
      accent: "#6BBFAC",
      name: "Wanderer",
      price: "£0",
      period: "forever",
      tagline: "Start exploring China with Toto",
      features: [
        "AI travel chat (daily limit)",
        "10 city guides & 18 itinerary templates",
        "Interactive maps & place cards",
        "WeChat Pay, rail & VPN toolkit",
      ],
      cta: "Start free",
      highlight: false,
    },
    {
      id: "trip",
      icon: Plane,
      accent: "#E95331",
      name: "Trip Pass",
      price: "£14.99",
      period: "one trip · 30 days",
      tagline: "Everything you need for one journey",
      features: [
        "Unlimited AI planning for 30 days",
        "Save trips, places & itineraries",
        "Day-by-day itinerary builder",
        "Export itineraries (PDF / offline)",
        "Priority AI responses",
      ],
      cta: "Get Trip Pass",
      highlight: true,
    },
    {
      id: "pro",
      icon: Crown,
      accent: "#E7B61B",
      name: "Pro Explorer",
      price: "£49",
      period: "per year",
      tagline: "For frequent China travellers",
      features: [
        "Everything in Trip Pass, all year",
        "Unlimited trips & saved places",
        "Early access to new features",
        "Real-time travel companion mode",
        "Priority support",
      ],
      cta: "Go Pro",
      highlight: false,
    },
  ];

  const handleSelect = (tierId: string) => {
    trackEvent("pricing_tier_click", { tier: tierId });
    if (tierId === "free") {
      router.push(`/chat/temp-${Date.now()}`);
      return;
    }
    const link = STRIPE_LINKS[tierId];
    if (link) {
      trackEvent("checkout_started", { tier: tierId });
      window.open(link, "_blank", "noopener");
    } else {
      // Payments not yet live — capture interest instead
      window.location.href = `mailto:hello@tototrip.com?subject=${encodeURIComponent(
        `Early access: ${tierId === "trip" ? "Trip Pass" : "Pro"} plan`
      )}`;
    }
  };

  return (
    <section
      id="pricing"
      className="relative z-0 py-10 md:py-14 px-4 bg-white dark:bg-[#0a1a13]"
      aria-label="Pricing"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 md:mb-10">
          <p className="text-xs font-bold tracking-[0.2em] text-[#E95331] uppercase mb-2">
            {"Simple pricing"}
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-[#083022] dark:text-white mb-2">
            {"Free to start. Upgrade when you travel."}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            {"Plan your first trip free. Unlock the full toto experience when you're ready to go."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative flex flex-col rounded-2xl border p-6 bg-white dark:bg-[#0d2a1f] card-hover ${
                tier.highlight
                  ? "border-[#E95331] shadow-lg shadow-[#E95331]/10 md:-translate-y-2"
                  : "border-[#E0C4BC]/40 dark:border-white/10"
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#E95331] text-white whitespace-nowrap">
                  {"Most popular"}
                </span>
              )}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${tier.accent}1A` }}
              >
                <tier.icon className="h-5 w-5" style={{ color: tier.accent }} />
              </div>
              <h3 className="text-lg font-bold text-[#083022] dark:text-white">
                {tier.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                {tier.tagline}
              </p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-[#083022] dark:text-white">
                  {tier.price}
                </span>
                <span className="text-xs text-slate-400">{tier.period}</span>
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {tier.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: tier.accent }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSelect(tier.id)}
                className={
                  tier.highlight
                    ? "w-full bg-[#E95331] hover:bg-[#d4492c] text-white"
                    : "w-full bg-[#083022] hover:bg-[#0d4a33] text-white dark:bg-white/10 dark:hover:bg-white/20"
                }
              >
                {tier.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          {"Prices include VAT. Secure checkout powered by Stripe. 14-day money-back guarantee on all paid plans."}
        </p>
      </div>
    </section>
  );
}
