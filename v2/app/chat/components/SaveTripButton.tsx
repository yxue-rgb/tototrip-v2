"use client";

import { useState } from "react";
import { Save, Check, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Itinerary } from "@/lib/parseItinerary";
import type { Location } from "@/lib/types";
import { saveTrip, encodeTripForSharing, extractCities, generateTripName } from "@/lib/savedTrips";
import { useI18n } from "@/contexts/I18nContext";
import { trackEvent } from "@/lib/analytics";

interface SaveTripButtonProps {
  itinerary: Itinerary;
  locations: Location[];
}

export function SaveTripButton({ itinerary, locations }: SaveTripButtonProps) {
  const [saved, setSaved] = useState(false);
  const [sharing, setSharing] = useState(false);
  const { t } = useI18n();

  const handleSave = () => {
    try {
      saveTrip(itinerary.days, locations);
      setSaved(true);
      trackEvent('trip_saved');
      toast.success(t("trips.savedToast"));
      // Reset after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      toast.error("Failed to save trip");
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const cities = extractCities(itinerary.days);
      const name = generateTripName(cities, itinerary.days.length);
      const tripData = {
        id: 'share',
        name,
        cities,
        days: itinerary.days.length,
        itinerary: itinerary.days,
        locations,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const encoded = encodeTripForSharing(tripData);
      const url = `${window.location.origin}/trips/shared?data=${encoded}`;
      await navigator.clipboard.writeText(url);
      toast.success(t("trips.linkCopiedToast"));
    } catch (e) {
      toast.error("Failed to create share link");
    } finally {
      setSharing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="flex items-center gap-2 mt-3"
    >
      <button
        onClick={handleSave}
        disabled={saved}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm ${
          saved
            ? "bg-[#6BBFAC] text-white cursor-default"
            : "bg-[#083022] hover:bg-[#0a4a32] text-white hover:shadow-md"
        }`}
      >
        {saved ? (
          <>
            <Check className="h-4 w-4" />
            {t("trips.saved")}
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            {t("trips.saveTrip")}
          </>
        )}
      </button>

      <button
        onClick={handleShare}
        disabled={sharing}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-[#0d2a1f] border border-[#E0C4BC]/30 dark:border-white/10 text-[#083022] dark:text-slate-200 hover:bg-[#E0C4BC]/20 dark:hover:bg-white/5 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Share2 className="h-4 w-4" />
        {t("trips.share")}
      </button>
    </motion.div>
  );
}
