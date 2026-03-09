"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const { t, locale } = useI18n();

  const content = locale === "zh" ? zhContent : enContent;

  return (
    <div className="min-h-screen bg-[#FBF7F4] dark:bg-[#071e16]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#FBF7F4]/80 dark:bg-[#071e16]/80 border-b border-[#E0C4BC]/20 dark:border-white/5">
        <div className="container mx-auto max-w-4xl flex items-center justify-between px-4 h-14">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#083022]/60 dark:text-white/60 hover:text-[#083022] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <Image
              src="/brand/toto_logo_plain_dark.png"
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

      <main className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <div className="mb-12">
            <p className="font-subtitle text-[#6BBFAC] tracking-widest text-xs uppercase mb-3">
              Legal
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-[#083022] dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm text-[#083022]/40 dark:text-white/40">
              {content.lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-[#083022] dark:prose-headings:text-white prose-p:text-[#083022]/70 dark:prose-p:text-white/60 prose-li:text-[#083022]/70 dark:prose-li:text-white/60 prose-a:text-[#6BBFAC] prose-a:no-underline hover:prose-a:underline prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3">
            {content.sections.map((section, i) => (
              <div key={i}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {section.list && (
                  <ul>
                    {section.list.map((item, k) => (
                      <li key={k}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Mini footer */}
      <footer className="py-8 px-4 bg-[#083022] border-t border-[#6BBFAC]/10">
        <div className="container mx-auto max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            &copy; 2026 toto. {t("footer.allRightsReserved")}
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">
              {t("footer.terms")}
            </Link>
            <Link href="/about" className="text-sm text-white/40 hover:text-[#99B7CF] transition-colors">
              {t("footer.about")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Content ─── */

interface Section {
  title: string;
  paragraphs: string[];
  list?: string[];
}

const enContent: { lastUpdated: string; sections: Section[] } = {
  lastUpdated: "Last updated: March 9, 2026",
  sections: [
    {
      title: "Introduction",
      paragraphs: [
        "Welcome to toto (\"we\", \"our\", or \"us\"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website at tototrip.com and related services (the \"Service\").",
        "By using toto, you agree to the collection and use of information in accordance with this policy.",
      ],
    },
    {
      title: "Information We Collect",
      paragraphs: [
        "We collect minimal information to provide you with the best travel planning experience:",
      ],
      list: [
        "Conversation Data — When you chat with our AI assistant, your messages and the AI's responses are processed to generate travel advice. If you are signed in, conversations are stored securely in our database so you can access them later.",
        "Local Storage — We use your browser's localStorage to save your preferences (theme, language, recent searches). This data never leaves your device.",
        "Account Information — If you choose to create an account (via Google or email), we store your name, email address, and profile picture to personalize your experience.",
        "Usage Analytics — We may collect anonymous, aggregated usage data (page views, feature usage) to improve the Service. No personally identifiable information is included.",
      ],
    },
    {
      title: "Cookies",
      paragraphs: [
        "toto does not use tracking cookies. We use localStorage for preference storage and session-based authentication tokens. No third-party advertising or tracking cookies are placed on your device.",
      ],
    },
    {
      title: "Third-Party Services",
      paragraphs: [
        "To provide AI-powered travel advice, we send your conversation messages to third-party AI service providers (such as OpenAI and Anthropic) for processing. These providers process your data in accordance with their own privacy policies.",
        "We also use the following third-party services:",
      ],
      list: [
        "Authentication providers (Google OAuth) — for account sign-in",
        "Supabase — for secure data storage and authentication",
        "Zeabur — for hosting infrastructure",
      ],
    },
    {
      title: "Data Retention",
      paragraphs: [
        "Conversation data for signed-in users is retained until you delete it or delete your account. Local storage data persists in your browser until you clear it manually. Anonymous usage data is retained in aggregate form indefinitely.",
      ],
    },
    {
      title: "Data Security",
      paragraphs: [
        "We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All data in transit is encrypted using TLS/SSL.",
      ],
    },
    {
      title: "Your Rights",
      paragraphs: ["You have the right to:"],
      list: [
        "Access — Request a copy of the personal data we hold about you",
        "Delete — Request deletion of your account and associated data",
        "Portability — Export your conversation history",
        "Correction — Update or correct your personal information",
      ],
    },
    {
      title: "Children's Privacy",
      paragraphs: [
        "Our Service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us.",
      ],
    },
    {
      title: "Changes to This Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the 'Last updated' date.",
      ],
    },
    {
      title: "Contact Us",
      paragraphs: [
        "If you have any questions about this Privacy Policy or your personal data, please contact us at hello@tototrip.com.",
      ],
    },
  ],
};

const zhContent: { lastUpdated: string; sections: Section[] } = {
  lastUpdated: "最后更新：2026年3月9日",
  sections: [
    {
      title: "简介",
      paragraphs: [
        "欢迎使用 toto（以下简称「我们」）。我们致力于保护您的隐私。本隐私政策解释了当您使用 tototrip.com 网站及相关服务（以下简称「服务」）时，我们如何收集、使用和保护您的信息。",
        "使用 toto 即表示您同意按照本政策收集和使用信息。",
      ],
    },
    {
      title: "我们收集的信息",
      paragraphs: ["我们收集最少的信息来为您提供最佳的旅行规划体验："],
      list: [
        "对话数据 — 当您与我们的 AI 助手聊天时，您的消息和 AI 的回复将被处理以生成旅行建议。如果您已登录，对话将安全存储在我们的数据库中，以便您稍后访问。",
        "本地存储 — 我们使用浏览器的 localStorage 保存您的偏好设置（主题、语言、最近搜索）。这些数据不会离开您的设备。",
        "账户信息 — 如果您选择创建账户（通过 Google 或邮箱），我们会存储您的姓名、电子邮件地址和头像以个性化您的体验。",
        "使用分析 — 我们可能会收集匿名的、汇总的使用数据（页面浏览量、功能使用情况）来改进服务。不包含个人身份信息。",
      ],
    },
    {
      title: "Cookie",
      paragraphs: [
        "toto 不使用跟踪 Cookie。我们使用 localStorage 存储偏好设置和基于会话的身份验证令牌。不会在您的设备上放置任何第三方广告或跟踪 Cookie。",
      ],
    },
    {
      title: "第三方服务",
      paragraphs: [
        "为提供 AI 驱动的旅行建议，我们会将您的对话消息发送给第三方 AI 服务提供商（如 OpenAI 和 Anthropic）进行处理。这些提供商根据其自身的隐私政策处理您的数据。",
        "我们还使用以下第三方服务：",
      ],
      list: [
        "身份验证提供商（Google OAuth）— 用于账户登录",
        "Supabase — 用于安全数据存储和身份验证",
        "Zeabur — 用于托管基础设施",
      ],
    },
    {
      title: "数据保留",
      paragraphs: [
        "已登录用户的对话数据将保留到您删除它或删除账户为止。本地存储数据会保留在您的浏览器中，直到您手动清除。匿名使用数据以汇总形式无限期保留。",
      ],
    },
    {
      title: "数据安全",
      paragraphs: [
        "我们采取适当的技术和组织措施来保护您的个人数据免受未经授权的访问、篡改、披露或销毁。所有传输中的数据均使用 TLS/SSL 加密。",
      ],
    },
    {
      title: "您的权利",
      paragraphs: ["您有权："],
      list: [
        "访问 — 请求获取我们持有的关于您的个人数据副本",
        "删除 — 请求删除您的账户和相关数据",
        "可移植性 — 导出您的对话历史记录",
        "更正 — 更新或纠正您的个人信息",
      ],
    },
    {
      title: "儿童隐私",
      paragraphs: [
        "我们的服务不面向 13 岁以下的儿童。我们不会故意收集 13 岁以下儿童的个人信息。如果您认为某位儿童向我们提供了个人数据，请与我们联系。",
      ],
    },
    {
      title: "政策变更",
      paragraphs: [
        "我们可能会不时更新本隐私政策。我们会通过在本页面发布新政策并更新「最后更新」日期来通知您任何变更。",
      ],
    },
    {
      title: "联系我们",
      paragraphs: [
        "如果您对本隐私政策或您的个人数据有任何疑问，请通过 hello@tototrip.com 与我们联系。",
      ],
    },
  ],
};
