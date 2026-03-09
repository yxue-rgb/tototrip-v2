import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat with Toto — Plan Your China Trip",
  description:
    "Chat with toto, your AI travel buddy, to plan your China trip. Get personalized itineraries, payment setup help, food recommendations, and real-time travel assistance.",
  openGraph: {
    title: "Chat with Toto — Plan Your China Trip | toto",
    description:
      "Chat with toto to plan your perfect China trip. Personalized itineraries, payment help, and real-time travel assistance.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat with Toto | toto",
    description:
      "Chat with your AI travel buddy to plan your perfect China trip.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
