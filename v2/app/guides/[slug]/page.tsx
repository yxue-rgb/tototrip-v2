import { notFound } from "next/navigation";
import { Metadata } from "next";
import { GUIDES } from "@/lib/guides-data";
import { GuideContent } from "./GuideContent";

export function generateStaticParams() {
  return GUIDES.map((guide) => ({
    slug: guide.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const guide = GUIDES.find((g) => g.slug === params.slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.excerpt,
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      type: "article",
      images: [{ url: guide.coverImage, width: 800, height: 600 }],
    },
  };
}

export default function GuidePage({
  params,
}: {
  params: { slug: string };
}) {
  const guide = GUIDES.find((g) => g.slug === params.slug);
  if (!guide) notFound();

  return <GuideContent guide={guide} />;
}
