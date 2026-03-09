import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { Toaster } from "sonner";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { OfflineBanner } from "@/components/OfflineBanner";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { Analytics } from "@/components/Analytics";
import { CookieConsent } from "@/components/CookieConsent";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#083022",
};

export const metadata: Metadata = {
  title: {
    default: "toto — Plan Your China Trip with AI in Minutes",
    template: "%s | toto",
  },
  description: "Free AI trip planner for foreigners visiting China. Get instant itineraries, WeChat Pay setup, train booking help, VPN guides, food tips & real-time travel support.",
  keywords: ["China travel", "travel to China", "China trip planner", "AI travel assistant", "China visa", "WeChat Pay tourist", "China travel guide", "toto travel", "China for foreigners", "China itinerary", "visit China"],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/brand/window_toto_square.png",
  },
  metadataBase: new URL("https://tototrip.com"),
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "toto",
  },
  openGraph: {
    title: "toto — Plan Your China Trip with AI in Minutes",
    description: "Free AI trip planner for foreigners visiting China. Instant itineraries, WeChat Pay, trains, VPN, food — all sorted.",
    type: "website",
    siteName: "toto",
    locale: "en_US",
    url: "https://tototrip.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "toto — Plan Your China Trip with AI in Minutes",
    description: "Free AI trip planner for foreigners visiting China. Instant itineraries, WeChat Pay, trains, VPN, food — all sorted.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/brand/window_toto_square.png" />
        {/* Preload critical brand fonts to avoid FOIT */}
        <link rel="preload" href="/fonts/GraphikArabic-Light.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Amelie-Fierce-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){try{var t=localStorage.getItem('tototrip-theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})();
        `}} />
        <Analytics />
      </head>
      <body className="antialiased bg-background text-foreground">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <OfflineBanner />
              {children}
              <FeedbackWidget />
              <CookieConsent />
              <Toaster
                position="top-center"
                richColors
                toastOptions={{
                  style: {
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                  },
                }}
              />
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
