"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, Calendar, Trash2, Compass, MessageCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { useI18n } from "@/contexts/I18nContext";
import { getSavedTrips, deleteSavedTrip, type SavedTrip } from "@/lib/savedTrips";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function TripCard({ trip, onDelete, onClick }: {
  trip: SavedTrip;
  onDelete: (id: string) => void;
  onClick: () => void;
}) {
  const { t } = useI18n();
  const totalStops = trip.itinerary.reduce((sum, d) => sum + d.items.length, 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-[#0d2a1f] rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden cursor-pointer hover:shadow-lg hover:border-[#E0C4BC]/40 dark:hover:border-white/20 transition-all duration-300"
      onClick={onClick}
    >
      {/* Color header band */}
      <div className="h-2 bg-gradient-to-r from-[#E95331] via-[#E7B61B] to-[#6BBFAC]" />

      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-[#083022] dark:text-white text-base mb-2 group-hover:text-[#E95331] dark:group-hover:text-[#6BBFAC] transition-colors line-clamp-1">
          {trip.name}
        </h3>

        {/* Cities */}
        {trip.cities.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin className="h-3.5 w-3.5 text-[#E95331] flex-shrink-0" />
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {trip.cities.join(" → ")}
            </span>
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {trip.days} {trip.days > 1 ? t("trips.days") : t("trips.day")}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {totalStops} stops
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(trip.createdAt)}
          </span>
        </div>

        {/* Bottom row with delete */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-white/5">
          <span className="text-[10px] text-slate-300 dark:text-slate-600 uppercase tracking-wider font-medium">
            {t("trips.created")} {formatDate(trip.createdAt)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(trip.id);
            }}
            className="p-2 rounded-lg text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={t("trips.delete")}
            aria-label={`${t("trips.delete")} ${trip.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function TripsPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTrips(getSavedTrips());
    setMounted(true);
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm(t("trips.deleteConfirm"))) return;
    const success = deleteSavedTrip(id);
    if (success) {
      setTrips(getSavedTrips());
      toast.success(t("trips.deleted"));
    }
  };

  if (!mounted) {
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a1a13]">
      <AppHeader currentPage="trips" />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-display text-[#083022] dark:text-white tracking-tight">
            {t("trips.myTrips")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {trips.length > 0
              ? t("trips.tripCount").replace("{count}", String(trips.length))
              : ""
            }
          </p>
        </div>

        {/* Empty state */}
        {trips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[400px] text-center"
          >
            <div className="relative mb-6">
              <div className="w-24 h-24 relative mx-auto animate-float">
                <Image
                  src="/brand/totos/family_toto.png"
                  alt="Toto waiting"
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
            </div>

            <h2 className="text-xl font-display text-[#083022] dark:text-white mb-2">
              {t("trips.emptyTitle")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
              {t("trips.emptyDesc")}
            </p>
            <button
              onClick={() => router.push("/chat/new")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#083022] hover:bg-[#0a4a32] text-white font-medium shadow-lg shadow-[#083022]/20 transition-all duration-200"
            >
              <MessageCircle className="h-4 w-4" />
              {t("trips.startChatting")}
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onDelete={handleDelete}
                  onClick={() => router.push(`/trips/${trip.id}`)}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
