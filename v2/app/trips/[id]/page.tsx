"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Share2, Trash2, Save, Check } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { useI18n } from "@/contexts/I18nContext";
import {
  getSavedTrip,
  deleteSavedTrip,
  encodeTripForSharing,
  saveTrip as saveNewTrip,
  type SavedTrip,
} from "@/lib/savedTrips";
import dynamic from "next/dynamic";

const ItineraryTimeline = dynamic(
  () => import("@/app/chat/components/ItineraryTimeline").then((mod) => mod.ItineraryTimeline),
  { ssr: false, loading: () => <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" /> }
);

const LocationMap = dynamic(
  () => import("@/app/chat/components/LocationMap").then((mod) => mod.LocationMap),
  { ssr: false, loading: () => <div className="h-[300px] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" /> }
);

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { t } = useI18n();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [tripId, setTripId] = useState("");

  useEffect(() => {
    params.then((p) => setTripId(p.id));
  }, [params]);

  useEffect(() => {
    if (!tripId) return;
    const found = getSavedTrip(tripId);
    setTrip(found);
    setLoading(false);
  }, [tripId]);

  const handleDelete = () => {
    if (!confirm(t("trips.deleteConfirm"))) return;
    deleteSavedTrip(tripId);
    toast.success(t("trips.deleted"));
    router.push("/trips");
  };

  const handleShare = async () => {
    if (!trip) return;
    try {
      const encoded = encodeTripForSharing(trip);
      const url = `${window.location.origin}/trips/shared?data=${encoded}`;
      await navigator.clipboard.writeText(url);
      toast.success(t("trips.linkCopiedToast"));
    } catch (e) {
      toast.error("Failed to create share link");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a1a13]">
        <AppHeader currentPage="trips" />
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

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a1a13]">
        <AppHeader currentPage="trips" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-slate-500 dark:text-slate-400 mb-4">Trip not found</p>
            <button
              onClick={() => router.push("/trips")}
              className="px-4 py-2 rounded-xl bg-[#083022] text-white hover:bg-[#0a4a32] transition-colors"
            >
              {t("trips.backToTrips")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalStops = trip.itinerary.reduce((sum, d) => sum + d.items.length, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a1a13]">
      <AppHeader currentPage="trips" />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <button
          onClick={() => router.push("/trips")}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-[#083022] dark:hover:text-white mb-6 -ml-1 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("trips.backToTrips")}
        </button>

        {/* Trip Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#083022] dark:text-white tracking-tight mb-2">
                {trip.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                {trip.cities.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#E95331]" />
                    {trip.cities.join(" → ")}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {trip.days} {trip.days > 1 ? t("trips.days") : t("trips.day")} · {totalStops} stops
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-[#0d2a1f] border border-[#E0C4BC]/30 dark:border-white/10 text-[#083022] dark:text-slate-200 hover:bg-[#E0C4BC]/20 dark:hover:bg-white/5 transition-all duration-200 shadow-sm"
              >
                <Share2 className="h-4 w-4" />
                {t("trips.share")}
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
                {t("trips.delete")}
              </button>
            </div>
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
