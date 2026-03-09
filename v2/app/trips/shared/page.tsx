"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Share2, Save, Check, AlertTriangle, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { useI18n } from "@/contexts/I18nContext";
import { decodeTripFromSharing, saveTrip, type SavedTrip } from "@/lib/savedTrips";
import dynamic from "next/dynamic";

const ItineraryTimeline = dynamic(
  () => import("@/app/chat/components/ItineraryTimeline").then((mod) => mod.ItineraryTimeline),
  { ssr: false, loading: () => <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" /> }
);

const LocationMap = dynamic(
  () => import("@/app/chat/components/LocationMap").then((mod) => mod.LocationMap),
  { ssr: false, loading: () => <div className="h-[300px] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" /> }
);

function SharedTripContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useI18n();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = searchParams.get("data");
    if (!data) {
      setError(true);
      return;
    }
    const decoded = decodeTripFromSharing(data);
    if (!decoded) {
      setError(true);
      return;
    }
    setTrip(decoded);
  }, [searchParams]);

  const handleSave = () => {
    if (!trip) return;
    try {
      saveTrip(trip.itinerary, trip.locations);
      setSaved(true);
      toast.success(t("trips.savedToast"));
    } catch (e) {
      toast.error("Failed to save trip");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a1a13]">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6">
              <AlertTriangle className="h-10 w-10 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-[#083022] dark:text-white mb-2">
              {t("trips.invalidLink")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
              {t("trips.invalidLinkDesc")}
            </p>
            <button
              onClick={() => router.push("/chat/new")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#083022] hover:bg-[#0a4a32] text-white font-medium shadow-lg shadow-[#083022]/20 transition-all duration-200"
            >
              <MessageCircle className="h-4 w-4" />
              {t("trips.startChatting")}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a1a13]">
        <AppHeader />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-[#E95331] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#E7B61B] animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#6BBFAC] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  const totalStops = trip.itinerary.reduce((sum, d) => sum + d.items.length, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a1a13]">
      <AppHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Shared trip banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 px-4 py-3 rounded-xl bg-[#6BBFAC]/10 border border-[#6BBFAC]/20 flex items-center gap-3"
        >
          <Share2 className="h-4 w-4 text-[#6BBFAC] flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[#083022] dark:text-white">
              {t("trips.sharedTrip")}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("trips.sharedDesc")}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saved}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm flex-shrink-0 ${
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
                {t("trips.saveSharedTrip")}
              </>
            )}
          </button>
        </motion.div>

        {/* Trip Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-[#083022] dark:text-white tracking-tight mb-2">
            {trip.name}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
            {trip.cities.length > 0 && (
              <span className="flex items-center gap-1.5">
                🗺️ {trip.cities.join(" → ")}
              </span>
            )}
            <span>
              📅 {trip.days} {trip.days > 1 ? t("trips.days") : t("trips.day")} · {totalStops} stops
            </span>
          </div>
        </motion.div>

        {/* Location Map */}
        {trip.locations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <LocationMap locations={trip.locations} height="350px" />
          </motion.div>
        )}

        {/* Itinerary Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ItineraryTimeline itinerary={{ days: trip.itinerary }} />
        </motion.div>
      </div>
    </div>
  );
}

export default function SharedTripPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a1a13]">
        <AppHeader />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-[#E95331] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#E7B61B] animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-[#6BBFAC] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    }>
      <SharedTripContent />
    </Suspense>
  );
}
