"use client";

import { motion } from "framer-motion";
import { SharedNavbar } from "@/components/SharedNavbar";
import { SharedFooter } from "@/components/SharedFooter";
import { PricingSection } from "@/components/PricingSection";
import { ShieldCheck, RefreshCcw, MessageCircleQuestion } from "lucide-react";

export default function PricingPage() {
  const faqs = [
    { icon: MessageCircleQuestion, q: "Can I use toto for free forever?", a: "Yes. The Wanderer plan is free for good — chat with Toto, browse all guides and templates, and plan short trips with a daily AI limit." },
    { icon: RefreshCcw, q: "What happens when my Trip Pass expires?", a: "Your saved trips and places stay in your account. You simply move back to the free plan — upgrade again whenever your next adventure comes up." },
    { icon: ShieldCheck, q: "Refunds?", a: "All paid plans come with a 14-day money-back guarantee, no questions asked. Email hello@tototrip.com and we'll sort it." },
  ];

  return (
    <div className="min-h-screen bg-[var(--brand-cream)] dark:bg-[#0a1a13]">
      <SharedNavbar activePage="pricing" />

      {/* Hero */}
      <section className="relative pt-28 pb-4 px-4 text-center overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#6BBFAC]/10 rounded-full blur-[100px]" />
        <div className="absolute -top-12 -left-24 w-80 h-80 bg-[#E7B61B]/10 rounded-full blur-[100px]" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative container mx-auto max-w-2xl"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-[#083022] dark:text-white mb-3">
            {"Pick your travel companion"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 md:text-lg">
            {"From a quick question to a full journey across China — there's a plan for every traveller."}
          </p>
        </motion.div>
      </section>

      <PricingSection />

      {/* FAQ */}
      <section className="py-10 md:py-14 px-4 bg-[var(--brand-cream)] dark:bg-[#0d1f17]">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#083022] dark:text-white text-center mb-8">
            {"Questions, answered"}
          </h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-5 bg-white dark:bg-[#0d2a1f] rounded-xl border border-[#E0C4BC]/30 dark:border-white/10"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6BBFAC]/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="h-4 w-4 text-[#6BBFAC]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#083022] dark:text-white text-sm mb-1">{f.q}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{f.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}
