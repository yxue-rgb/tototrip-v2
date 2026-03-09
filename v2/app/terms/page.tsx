"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { SharedFooter } from "@/components/SharedFooter";
import { motion } from "framer-motion";

export default function TermsPage() {
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
              Terms of Service
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

      <SharedFooter />
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
      title: "Acceptance of Terms",
      paragraphs: [
        "By accessing and using toto at tototrip.com (the \"Service\"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.",
      ],
    },
    {
      title: "Description of Service",
      paragraphs: [
        "toto is an AI-powered travel companion designed to help you plan and navigate trips to China. The Service provides information about destinations, transportation, payments, food, language, and cultural customs through an AI chat interface and curated content pages.",
        "The Service is provided free of charge and may include both free and premium features in the future.",
      ],
    },
    {
      title: "User Responsibilities",
      paragraphs: ["When using the Service, you agree to:"],
      list: [
        "Provide accurate information when creating an account",
        "Use the Service only for lawful purposes related to travel planning",
        "Not attempt to reverse-engineer, hack, or disrupt the Service",
        "Not use the Service to generate harmful, abusive, or misleading content",
        "Keep your account credentials secure and confidential",
      ],
    },
    {
      title: "AI-Generated Content Disclaimer",
      paragraphs: [
        "IMPORTANT: The travel advice, recommendations, and information provided by our AI assistant are generated by artificial intelligence and are for informational purposes only. This content does not constitute professional travel advice, legal advice, medical advice, or financial advice.",
        "While we strive for accuracy, AI-generated responses may contain errors, outdated information, or inaccuracies. Always verify critical information (visa requirements, safety advisories, health regulations) with official sources such as government travel advisories and embassy websites.",
        "toto is not liable for any decisions you make based on AI-generated content. You use the Service and act on its recommendations at your own risk.",
      ],
    },
    {
      title: "Intellectual Property",
      paragraphs: [
        "All content, design, branding, logos, illustrations, and code that make up the Service are the intellectual property of toto and are protected by applicable copyright and trademark laws.",
        "You may not reproduce, distribute, modify, or create derivative works of any part of the Service without our prior written consent. Your conversation history belongs to you, and you may export or delete it at any time.",
      ],
    },
    {
      title: "User Content",
      paragraphs: [
        "When you submit messages through the chat interface, you retain ownership of your content. By using the Service, you grant us a limited license to process your messages through AI service providers for the sole purpose of generating responses.",
        "We do not use your conversations for advertising purposes or share them with third parties beyond what is necessary to operate the Service.",
      ],
    },
    {
      title: "Limitation of Liability",
      paragraphs: [
        "The Service is provided \"as is\" and \"as available\" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or that any information provided will be accurate or complete.",
        "To the fullest extent permitted by law, toto shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.",
      ],
    },
    {
      title: "Termination",
      paragraphs: [
        "We reserve the right to suspend or terminate your access to the Service at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users or the Service.",
        "You may stop using the Service at any time. If you wish to delete your account and associated data, please contact us or use the account deletion feature.",
      ],
    },
    {
      title: "Changes to Terms",
      paragraphs: [
        "We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to this page. Your continued use of the Service after changes constitutes acceptance of the revised Terms.",
      ],
    },
    {
      title: "Governing Law",
      paragraphs: [
        "These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to its conflict of law provisions.",
      ],
    },
    {
      title: "Contact",
      paragraphs: [
        "For any questions about these Terms of Service, please reach out to us at hello@tototrip.com.",
      ],
    },
  ],
};

const zhContent: { lastUpdated: string; sections: Section[] } = {
  lastUpdated: "最后更新：2026年3月9日",
  sections: [
    {
      title: "接受条款",
      paragraphs: [
        "访问和使用 tototrip.com 上的 toto（以下简称「服务」），即表示您接受并同意受这些服务条款的约束。如果您不同意这些条款，请不要使用本服务。",
      ],
    },
    {
      title: "服务描述",
      paragraphs: [
        "toto 是一个 AI 驱动的旅行伙伴，旨在帮助您规划和导航中国之旅。该服务通过 AI 聊天界面和精选内容页面提供关于目的地、交通、支付、美食、语言和文化习俗的信息。",
        "该服务免费提供，未来可能包含免费和付费功能。",
      ],
    },
    {
      title: "用户责任",
      paragraphs: ["使用本服务时，您同意："],
      list: [
        "创建账户时提供准确的信息",
        "仅将服务用于与旅行规划相关的合法目的",
        "不尝试逆向工程、黑客攻击或干扰服务",
        "不使用服务生成有害、辱骂或误导性内容",
        "妥善保管您的账户凭据",
      ],
    },
    {
      title: "AI 生成内容免责声明",
      paragraphs: [
        "重要提示：我们 AI 助手提供的旅行建议、推荐和信息由人工智能生成，仅供参考。此内容不构成专业旅行建议、法律建议、医疗建议或财务建议。",
        "虽然我们力求准确，但 AI 生成的回复可能包含错误、过时的信息或不准确之处。请务必通过官方来源（如政府旅行公告和大使馆网站）核实关键信息（签证要求、安全公告、健康法规）。",
        "toto 不对您基于 AI 生成内容做出的任何决定承担责任。您使用本服务并按照其建议行事的风险由您自行承担。",
      ],
    },
    {
      title: "知识产权",
      paragraphs: [
        "构成服务的所有内容、设计、品牌、标志、插图和代码均为 toto 的知识产权，受适用的版权和商标法保护。",
        "未经我们事先书面同意，您不得复制、分发、修改或创作服务任何部分的衍生作品。您的对话历史记录属于您，您可以随时导出或删除。",
      ],
    },
    {
      title: "用户内容",
      paragraphs: [
        "当您通过聊天界面提交消息时，您保留对您内容的所有权。使用本服务即表示您授予我们有限许可，以通过 AI 服务提供商处理您的消息，目的仅为生成回复。",
        "我们不会将您的对话用于广告目的，也不会在运营服务所需之外与第三方共享。",
      ],
    },
    {
      title: "责任限制",
      paragraphs: [
        "本服务按「现状」和「可用」基础提供，不提供任何明示或暗示的保证。我们不保证服务不会中断、无错误，或所提供的任何信息是准确或完整的。",
        "在法律允许的最大范围内，toto 不对因您使用服务而产生的任何间接、附带、特殊、后果性或惩罚性损害承担责任。",
      ],
    },
    {
      title: "终止",
      paragraphs: [
        "我们保留在任何时候暂停或终止您对服务的访问的权利，无论是否通知，如果我们认为您的行为违反了这些条款或对其他用户或服务有害。",
        "您可以随时停止使用本服务。如果您希望删除账户和相关数据，请联系我们或使用账户删除功能。",
      ],
    },
    {
      title: "条款变更",
      paragraphs: [
        "我们保留随时修改这些条款的权利。变更将在发布到本页面后立即生效。您在变更后继续使用服务即构成对修改后条款的接受。",
      ],
    },
    {
      title: "适用法律",
      paragraphs: [
        "这些条款应受英格兰和威尔士法律管辖并据其解释，不考虑其法律冲突条款。",
      ],
    },
    {
      title: "联系方式",
      paragraphs: [
        "如果您对这些服务条款有任何疑问，请通过 hello@tototrip.com 与我们联系。",
      ],
    },
  ],
};
