"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export function Analytics() {
  const [consentGiven, setConsentGiven] = useState(false);

  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;

  useEffect(() => {
    if (!analyticsId) return;

    const checkConsent = () => {
      const consent = localStorage.getItem("tototrip_cookie_consent");
      setConsentGiven(consent === "accepted");
    };

    checkConsent();

    // Listen for consent changes from CookieConsent component
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "tototrip_cookie_consent") {
        setConsentGiven(e.newValue === "accepted");
      }
    };

    // Custom event for same-tab consent updates
    const handleConsent = () => checkConsent();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("tototrip_consent_change", handleConsent);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("tototrip_consent_change", handleConsent);
    };
  }, [analyticsId]);

  if (!analyticsId || !consentGiven) return null;

  return (
    <Script
      defer
      data-domain="tototrip.zeabur.app"
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
