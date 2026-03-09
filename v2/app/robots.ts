import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/chat/", "/trips/", "/locations/"],
      },
    ],
    sitemap: "https://tototrip.com/sitemap.xml",
  };
}
