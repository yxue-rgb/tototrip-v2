import { Metadata } from "next";
import { CITIES } from "@/lib/city-data";

interface Props {
  params: Promise<{ city: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const city = CITIES.find((c) => c.slug === slug);

  if (!city) {
    return {
      title: "Destination Not Found",
    };
  }

  return {
    title: `${city.name} (${city.nameZh}) Travel Guide — Best Things to Do, Food & Tips`,
    description: `${city.tagline}. Discover top attractions, must-try food, transport tips, and plan your perfect trip to ${city.name} with toto AI.`,
    keywords: [
      `${city.name} travel guide`,
      `${city.name} things to do`,
      `${city.name} food`,
      `${city.name} attractions`,
      `visit ${city.name}`,
      `${city.name} China`,
      city.nameZh,
    ],
    openGraph: {
      title: `${city.name} Travel Guide | toto`,
      description: city.tagline,
      images: [{ url: city.heroImage, width: 1920, height: 1080, alt: `${city.name} - ${city.nameZh}` }],
      type: "article",
      url: `https://tototrip.com/destinations/${city.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${city.name} Travel Guide | toto`,
      description: city.tagline,
      images: [city.heroImage],
    },
    alternates: {
      canonical: `/destinations/${city.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return CITIES.map((city) => ({
    city: city.slug,
  }));
}

export default function DestinationLayout({ children }: Props) {
  return <>{children}</>;
}
