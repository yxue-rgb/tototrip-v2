"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ArrowLeft, MessageCircle, Search } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { SharedNavbar } from "@/components/SharedNavbar";
import { SharedFooter } from "@/components/SharedFooter";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  icon: string;
  label: Record<string, string>;
  faqs: Record<string, FAQ[]>;
}

const FAQ_DATA: FAQCategory[] = [
  {
    id: "general",
    icon: "🐕",
    label: { en: "General", zh: "常见问题" },
    faqs: {
      en: [
        {
          q: "What is TotoTrip?",
          a: "TotoTrip is an AI-powered travel companion designed specifically for people traveling to China. It helps you plan itineraries, navigate payments, understand local culture, and solve the everyday challenges of exploring China — from setting up WeChat Pay to ordering street food.",
        },
        {
          q: "Is TotoTrip free to use?",
          a: "Yes! TotoTrip is free to use. You can chat with our AI travel advisor, browse curated itineraries, and access our complete travel toolkit at no cost. We may introduce premium features in the future, but the core experience will always remain free.",
        },
        {
          q: "What languages does TotoTrip support?",
          a: "TotoTrip currently supports English and Chinese (简体中文). You can switch between languages at any time using the language toggle. Our AI chat can understand and respond in both languages, and we're working on adding more language support soon.",
        },
        {
          q: "Who is Toto?",
          a: "Toto is our adorable Shiba Inu mascot and your virtual travel buddy! Toto represents the spirit of curious, adventurous exploration. You'll see Toto throughout the app — as an explorer, foodie, nature lover, and more. 🐕",
        },
      ],
      zh: [
        {
          q: "TotoTrip 是什么？",
          a: "TotoTrip（途图旅行）是一个专为来中国旅行的外国游客打造的 AI 旅行助手。它帮助你规划行程、解决支付问题、了解当地文化，以及应对在中国旅行中遇到的各种日常挑战——从设置微信支付到点街边小吃。",
        },
        {
          q: "TotoTrip 免费吗？",
          a: "是的！TotoTrip 完全免费使用。你可以与我们的 AI 旅行顾问聊天、浏览精选行程，并免费使用我们完整的旅行工具包。我们未来可能会推出高级功能，但核心体验将永远免费。",
        },
        {
          q: "TotoTrip 支持哪些语言？",
          a: "TotoTrip 目前支持英文和中文（简体中文）。你可以随时使用语言切换按钮切换语言。我们的 AI 聊天可以理解并回复这两种语言，未来还会支持更多语言。",
        },
        {
          q: "Toto 是谁？",
          a: "Toto 是我们可爱的柴犬吉祥物，也是你的虚拟旅行伙伴！Toto 代表着好奇、冒险的探索精神。你会在应用中看到各种形态的 Toto——探险家、美食家、自然爱好者等等。🐕",
        },
      ],
    },
  },
  {
    id: "planning",
    icon: "🗺️",
    label: { en: "Trip Planning", zh: "行程规划" },
    faqs: {
      en: [
        {
          q: "How accurate are the AI-generated itineraries?",
          a: "Our itineraries are generated using up-to-date information about Chinese destinations, transport schedules, and local attractions. While we strive for accuracy, we recommend double-checking specific details like opening hours and prices, as these can change. Think of our plans as expert suggestions that you can customize to your needs.",
        },
        {
          q: "Can I edit an itinerary after it's generated?",
          a: "Absolutely! Our itineraries are designed to be starting points. You can chat with the AI to modify any aspect — swap destinations, adjust timing, change the pace, add food stops, or remove activities. Just tell Toto what you'd like to change.",
        },
        {
          q: "Does TotoTrip work offline?",
          a: "TotoTrip is primarily an online tool since it relies on AI for generating responses. However, you can save your itineraries for offline viewing, and our Travel Toolkit pages can be bookmarked for reference. We recommend downloading key information before your trip.",
        },
        {
          q: "How far in advance should I start planning?",
          a: "We recommend starting 2-4 weeks before your trip for the best experience. This gives you time to set up WeChat Pay, get a VPN, arrange your eSIM, and refine your itinerary. But even last-minute planners can get great results — our AI works instantly!",
        },
      ],
      zh: [
        {
          q: "AI 生成的行程准确吗？",
          a: "我们的行程使用关于中国目的地、交通时刻表和当地景点的最新信息生成。虽然我们力求准确，但建议你仔细核实开放时间和价格等具体细节，因为这些可能会变化。把我们的计划当作专家建议，你可以根据需要自定义。",
        },
        {
          q: "生成后可以编辑行程吗？",
          a: "当然可以！我们的行程只是起点。你可以与 AI 聊天来修改任何方面——更换目的地、调整时间、改变节奏、添加美食站或删除活动。告诉 Toto 你想改什么就行。",
        },
        {
          q: "TotoTrip 支持离线使用吗？",
          a: "TotoTrip 主要是在线工具，因为它依赖 AI 生成回复。不过，你可以保存行程以便离线查看，我们的旅行工具箱页面也可以加入书签以供参考。建议在旅行前下载关键信息。",
        },
        {
          q: "应该提前多久开始规划？",
          a: "我们建议在旅行前 2-4 周开始规划。这样你有时间设置微信支付、准备 VPN、安排 eSIM 并完善行程。但即使是临时计划也能获得很好的效果——我们的 AI 即时响应！",
        },
      ],
    },
  },
  {
    id: "china",
    icon: "🇨🇳",
    label: { en: "China Travel", zh: "中国旅行" },
    faqs: {
      en: [
        {
          q: "Do I need a VPN in China?",
          a: "If you want to access Google, YouTube, Instagram, WhatsApp, or most Western social media, yes — you'll need a VPN. However, if you use an eSIM with roaming (like Airalo or Holafly), it often bypasses the Great Firewall automatically. We recommend setting up a VPN before you arrive, as VPN websites are blocked inside China.",
        },
        {
          q: "How do I pay for things in China?",
          a: "China is almost entirely cashless. WeChat Pay and Alipay are the two dominant payment platforms, and both now accept foreign credit cards. We have a step-by-step guide in our Travel Toolkit to help you set up. Always carry some cash (¥500-1000) as a backup for small vendors.",
        },
        {
          q: "Is China safe for tourists?",
          a: "China is generally very safe for tourists, with low violent crime rates. Common sense precautions apply: watch your belongings in crowded areas, avoid unlicensed taxis, and keep your passport with you. Emergency number is 110 (police) and 120 (ambulance). Our AI can help with emergency phrases and nearby hospital information.",
        },
        {
          q: "Do I need a visa to visit China?",
          a: "It depends on your nationality. As of 2025, citizens of 50+ countries can enter China visa-free for 15-30 days. Many travelers also qualify for the 144-hour transit visa-free policy. Check our Travel Toolkit for the latest visa information, or ask our AI for advice specific to your nationality.",
        },
      ],
      zh: [
        {
          q: "在中国需要 VPN 吗？",
          a: "如果你想访问 Google、YouTube、Instagram、WhatsApp 或大多数西方社交媒体，是的——你需要 VPN。不过，如果你使用漫游 eSIM（如 Airalo 或 Holafly），它通常会自动绕过防火墙。建议在到达前设置好 VPN，因为 VPN 网站在中国境内是被屏蔽的。",
        },
        {
          q: "在中国怎么支付？",
          a: "中国几乎完全是无现金社会。微信支付和支付宝是两大支付平台，现在都接受外国信用卡。我们的旅行工具箱有详细的设置指南。建议随身携带一些现金（¥500-1000）作为备用。",
        },
        {
          q: "中国对游客安全吗？",
          a: "中国对游客来说总体非常安全，暴力犯罪率很低。注意基本的安全常识：在拥挤的地方看好随身物品、避免乘坐无牌照出租车、随身携带护照。紧急电话：110（警察）和 120（急救）。我们的 AI 可以帮你提供紧急用语和附近医院信息。",
        },
        {
          q: "去中国需要签证吗？",
          a: "这取决于你的国籍。截至 2025 年，50 多个国家的公民可以免签入境中国 15-30 天。许多旅客还符合 144 小时过境免签政策。查看我们的旅行工具箱了解最新签证信息，或向我们的 AI 咨询针对你国籍的建议。",
        },
      ],
    },
  },
  {
    id: "technical",
    icon: "⚙️",
    label: { en: "Technical", zh: "技术相关" },
    faqs: {
      en: [
        {
          q: "Can I save my trip itineraries?",
          a: "Yes! You can save any itinerary generated by our AI. Saved trips are stored in your account and accessible from the 'My Trips' section. You can also export them for offline reference.",
        },
        {
          q: "Can I share my itinerary with friends?",
          a: "Absolutely! Every saved trip has a share button that generates a unique link. Your travel companions can view the itinerary without needing an account. It's a great way to plan group trips together.",
        },
        {
          q: "How is my data handled? Is it private?",
          a: "Your privacy is important to us. Chat conversations are used to improve your experience but are not shared with third parties. We don't sell personal data. You can delete your account and data at any time. Read our full Privacy Policy for details.",
        },
      ],
      zh: [
        {
          q: "可以保存行程吗？",
          a: "可以！你可以保存 AI 生成的任何行程。保存的行程存储在你的账户中，可以从「我的行程」部分访问。你也可以导出以便离线参考。",
        },
        {
          q: "可以和朋友分享行程吗？",
          a: "当然可以！每个保存的行程都有分享按钮，可以生成唯一链接。你的旅伴无需注册即可查看行程，非常适合一起规划团体旅行。",
        },
        {
          q: "我的数据如何处理？隐私安全吗？",
          a: "你的隐私对我们很重要。聊天记录用于改善你的体验，但不会与第三方共享。我们不出售个人数据。你可以随时删除你的账户和数据。详情请阅读我们的隐私政策。",
        },
      ],
    },
  },
];

const PAGE_TEXT: Record<string, Record<string, string>> = {
  en: {
    badge: "Help Center",
    title: "Frequently Asked",
    titleHighlight: "Questions",
    subtitle: "Everything you need to know about using TotoTrip for your China adventure.",
    searchPlaceholder: "Search questions…",
    noResults: "No matching questions found. Try a different search term.",
    ctaTitle: "Still have questions?",
    ctaDesc: "Chat with our AI travel companion for personalized answers about your China trip.",
    ctaButton: "Chat with Toto",
  },
  zh: {
    badge: "帮助中心",
    title: "常见",
    titleHighlight: "问题",
    subtitle: "关于使用 TotoTrip 规划中国之旅的一切。",
    searchPlaceholder: "搜索问题…",
    noResults: "没有找到匹配的问题。试试其他搜索词。",
    ctaTitle: "还有其他问题？",
    ctaDesc: "与我们的 AI 旅行助手聊天，获取关于你中国之旅的个性化解答。",
    ctaButton: "与 Toto 聊天",
  },
};

function AccordionItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[#083022]/5 dark:border-white/5 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 px-1 text-left group"
      >
        <span className="text-[15px] font-medium text-[#083022] dark:text-white group-hover:text-[#6BBFAC] transition-colors leading-relaxed">
          {faq.q}
        </span>
        <ChevronDown
          className={`w-5 h-5 mt-0.5 flex-shrink-0 text-[#083022]/30 dark:text-white/30 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-[#6BBFAC]" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 px-1 text-sm text-[#083022]/60 dark:text-white/50 leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const { locale } = useI18n();
  const lang = locale === "zh" ? "zh" : "en";
  const t = PAGE_TEXT[lang];
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredCategories = FAQ_DATA.map((cat) => {
    const faqs = cat.faqs[lang] || cat.faqs.en;
    if (!search.trim()) return { ...cat, filteredFaqs: faqs };
    const lowerSearch = search.toLowerCase();
    const filtered = faqs.filter(
      (f) => f.q.toLowerCase().includes(lowerSearch) || f.a.toLowerCase().includes(lowerSearch)
    );
    return { ...cat, filteredFaqs: filtered };
  }).filter((cat) => cat.filteredFaqs.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7f4] to-white dark:from-[#060e0a] dark:to-[#0a1a14]">
      <SharedNavbar />

      <main className="container mx-auto max-w-4xl px-4 pt-24 md:pt-28 pb-16 md:pb-24">
        {/* Hero */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#6BBFAC]/10 text-[#6BBFAC] mb-6">
            {t.badge}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#083022] dark:text-white leading-tight mb-4">
            {t.title}{" "}
            <span className="text-[#6BBFAC]">{t.titleHighlight}</span>
          </h1>
          <p className="text-[#083022]/50 dark:text-white/40 text-base md:text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-lg mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#083022]/30 dark:text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm
              bg-white dark:bg-white/5
              border border-[#083022]/10 dark:border-white/10
              text-[#083022] dark:text-white
              placeholder:text-[#083022]/30 dark:placeholder:text-white/30
              focus:outline-none focus:ring-2 focus:ring-[#6BBFAC]/30 focus:border-[#6BBFAC]/40
              transition-all"
          />
        </div>

        {/* FAQ categories */}
        {filteredCategories.length === 0 ? (
          <p className="text-center text-[#083022]/40 dark:text-white/30 py-12">{t.noResults}</p>
        ) : (
          <div className="space-y-10">
            {filteredCategories.map((cat) => (
              <section key={cat.id}>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-[#083022] dark:text-white mb-2">
                  <span>{cat.icon}</span>
                  {cat.label[lang] || cat.label.en}
                </h2>
                <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-[#083022]/5 dark:border-white/5 px-6">
                  {cat.filteredFaqs.map((faq, i) => {
                    const itemId = `${cat.id}-${i}`;
                    return (
                      <AccordionItem
                        key={itemId}
                        faq={faq}
                        isOpen={openItems.has(itemId)}
                        onToggle={() => toggleItem(itemId)}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 md:mt-24 text-center">
          <div className="bg-[#083022] dark:bg-[#6BBFAC]/10 rounded-3xl p-8 md:p-12 max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-white dark:text-white mb-3">
              {t.ctaTitle}
            </h3>
            <p className="text-white/60 dark:text-white/40 text-sm mb-6 max-w-md mx-auto">
              {t.ctaDesc}
            </p>
            <Link
              href="/chat/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium
                bg-[#6BBFAC] text-[#083022] hover:bg-[#5aae9b] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {t.ctaButton}
            </Link>
          </div>
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}
