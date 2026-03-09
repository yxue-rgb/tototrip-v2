import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "China Travel Inspiration - Curated Trip Ideas",
  description:
    "Hand-crafted China itineraries by travel experts. Explore Beijing & Shanghai classics, deep southwest adventures, Xi'an Silk Road heritage, and more. Customize with AI.",
  keywords: [
    "China itinerary",
    "China trip ideas",
    "Beijing Shanghai itinerary",
    "Chengdu travel plan",
    "Xi'an travel guide",
    "China travel inspiration",
  ],
  openGraph: {
    title: "China Travel Inspiration - Curated Trip Ideas | toto",
    description:
      "Hand-crafted China itineraries by travel experts. Beijing, Shanghai, Chengdu, Xi'an and more — customize with AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "China Travel Inspiration | toto",
    description:
      "Curated China trip itineraries. Beijing, Shanghai, Chengdu, Xi'an — customize with AI.",
  },
  alternates: {
    canonical: "/inspiration",
  },
};

export default function InspirationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
