"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";

export function SharedFooter() {
  const { t } = useI18n();

  return (
    <footer className="py-12 px-4 bg-[#083022] border-t border-[#6BBFAC]/10" role="contentinfo">
      <div className="container mx-auto max-w-6xl">
        {/* Top: Brand + link columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand column */}
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
              <li><Link href="/chat/new" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("nav.chat")}</Link></li>
              <li><Link href="/inspiration" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("nav.inspiration")}</Link></li>
              <li><Link href="/guides" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("nav.guides")}</Link></li>
              <li><Link href="/toolkit" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("nav.toolkit")}</Link></li>
              <li><Link href="/#destinations" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("nav.destinations")}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t("footer.company")}</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("footer.about")}</Link></li>
              <li><Link href="/faq" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("footer.faq")}</Link></li>
              <li><Link href="/privacy" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link href="/terms" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">{t("footer.terms")}</Link></li>
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
            &copy; {new Date().getFullYear()} toto. {t("footer.allRightsReserved")}
          </p>
          <p className="text-sm text-white/20">
            Powered by toto 🐕
          </p>
        </div>
      </div>
    </footer>
  );
}
