import type { Metadata } from "next";
import { FAQPageJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "China Travel Toolkit - Payment, Visa, Transport Guide",
  description:
    "Complete survival guide for traveling in China. Learn how to set up WeChat Pay, get a visa, use high-speed rail, order food, and navigate with confidence.",
  keywords: [
    "China travel toolkit",
    "WeChat Pay setup",
    "China visa guide",
    "China high-speed rail",
    "China travel tips",
    "Alipay tourist",
    "China VPN",
    "China food guide",
  ],
  openGraph: {
    title: "China Travel Toolkit - Payment, Visa, Transport Guide | toto",
    description:
      "Complete survival guide for traveling in China. Payments, visa, internet, transport, food & language — all in one place.",
  },
  twitter: {
    card: "summary_large_image",
    title: "China Travel Toolkit | toto",
    description:
      "Complete survival guide for traveling in China. Payments, visa, internet, transport, food & language.",
  },
  alternates: {
    canonical: "/toolkit",
  },
};

const toolkitFaqs = [
  {
    question: "How do I set up WeChat Pay as a foreign tourist in China?",
    answer:
      "Since 2024, WeChat Pay accepts foreign credit/debit cards (Visa, Mastercard). Download WeChat, create an account with your phone number, go to Wallet → Cards → Add a Card, enter your foreign card details, and complete identity verification with your passport photo.",
  },
  {
    question: "Do I need a visa to visit China?",
    answer:
      "China offers a 144-hour transit visa-free policy for citizens of 54 countries when transiting through major cities. Additionally, as of 2025, citizens of 50+ countries (France, Germany, Australia, etc.) can enter visa-free for 15-30 days depending on nationality.",
  },
  {
    question: "How do I get internet access in China?",
    answer:
      "The easiest option is an eSIM (Airalo, Holafly, or Nomad) — buy before arriving and activate instantly. Most eSIM plans use roaming which bypasses the Great Firewall, letting you access Google, WhatsApp, and Instagram without a VPN.",
  },
  {
    question: "How do I book high-speed rail tickets in China?",
    answer:
      "Book on Trip.com (English-friendly) or the official 12306 app. Use your passport number when booking. You can pick up tickets at the station with your passport or use the e-ticket QR code. Arrive 30-45 minutes early for security and ID check.",
  },
  {
    question: "How do I order food in Chinese restaurants?",
    answer:
      "Most restaurants now use QR code ordering. Scan the QR code on your table with WeChat or Alipay, a digital menu appears — use your phone's translate feature if needed, select items and submit your order, then pay through the same interface.",
  },
  {
    question: "What essential Chinese phrases should I know for traveling?",
    answer:
      "Key phrases: 你好 (Nǐ hǎo - Hello), 谢谢 (Xiè xiè - Thank you), 多少钱 (Duō shǎo qián - How much?), 在哪里 (zài nǎ lǐ - Where is...?), 不要辣 (Bú yào là - Not spicy), 买单 (Mǎi dān - Bill please).",
  },
];

export default function ToolkitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FAQPageJsonLd faqs={toolkitFaqs} />
      {children}
    </>
  );
}
