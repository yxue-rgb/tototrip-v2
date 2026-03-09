"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  PlusCircle,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  Sun,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/contexts/I18nContext";
import type { PlaceData } from "@/lib/parsePlaces";

/* ── type config ── */
const TYPE_CONFIG: Record<
  string,
  { emoji: string; gradient: string; label: string; color: string; bg: string; darkBg: string }
> = {
  restaurant: {
    emoji: "🍜",
    gradient: "from-orange-400 to-amber-500",
    label: "Restaurant",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 border-orange-200",
    darkBg: "dark:bg-orange-500/10 dark:border-orange-500/30",
  },
  attraction: {
    emoji: "🏛️",
    gradient: "from-teal-400 to-emerald-500",
    label: "Attraction",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 border-teal-200",
    darkBg: "dark:bg-teal-500/10 dark:border-teal-500/30",
  },
  hotel: {
    emoji: "🏨",
    gradient: "from-purple-400 to-violet-500",
    label: "Hotel",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 border-purple-200",
    darkBg: "dark:bg-purple-500/10 dark:border-purple-500/30",
  },
  transport: {
    emoji: "🚄",
    gradient: "from-blue-400 to-cyan-500",
    label: "Transport",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 border-blue-200",
    darkBg: "dark:bg-blue-500/10 dark:border-blue-500/30",
  },
};

function getTypeConfig(type?: string) {
  return TYPE_CONFIG[type || "attraction"] || TYPE_CONFIG.attraction;
}

/**
 * Build an array of Unsplash image URLs for a place.
 * Falls back to the single `image` field if `images` is empty.
 * If nothing is available, returns an empty array (gradient placeholder used).
 */
function getImageUrls(place: PlaceData): string[] {
  const urls: string[] = [];
  if (place.images && place.images.length > 0) {
    urls.push(...place.images.filter(Boolean));
  }
  if (place.image && !urls.includes(place.image)) {
    urls.unshift(place.image);
  }
  return urls.filter(Boolean);
}

/* ── image carousel ── */
function ImageCarousel({
  images,
  fallbackGradient,
  fallbackEmoji,
  alt,
}: {
  images: string[];
  fallbackGradient: string;
  fallbackEmoji: string;
  alt: string;
}) {
  const [idx, setIdx] = useState(0);
  const [errored, setErrored] = useState<Set<number>>(new Set());
  const validImages = images.filter((_, i) => !errored.has(i));
  const total = validImages.length;

  const handleError = useCallback(
    (i: number) => {
      setErrored((prev) => new Set(prev).add(i));
      // If current image errors, try next
      if (i === idx) {
        const nextValid = images.findIndex((_, j) => j > i && !errored.has(j));
        if (nextValid !== -1) setIdx(nextValid);
      }
    },
    [idx, images, errored],
  );

  if (total === 0) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br ${fallbackGradient} flex items-center justify-center`}
      >
        <span className="text-5xl opacity-70">{fallbackEmoji}</span>
      </div>
    );
  }

  const prev = () => {
    const validIndices = images
      .map((_, i) => i)
      .filter((i) => !errored.has(i));
    const curPos = validIndices.indexOf(idx);
    setIdx(validIndices[(curPos - 1 + validIndices.length) % validIndices.length]);
  };
  const next = () => {
    const validIndices = images
      .map((_, i) => i)
      .filter((i) => !errored.has(i));
    const curPos = validIndices.indexOf(idx);
    setIdx(validIndices[(curPos + 1) % validIndices.length]);
  };

  return (
    <div className="relative w-full h-full group/carousel overflow-hidden">
      {/* Current image */}
      <img
        src={images[idx]}
        alt={alt}
        className="w-full h-full object-cover transition-opacity duration-300"
        onError={() => handleError(idx)}
        loading="lazy"
      />

      {/* Gradient overlay for controls visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

      {/* Navigation arrows (only when > 1 image) */}
      {total > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-black/70 shadow-md"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4 text-slate-700 dark:text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hover:bg-white dark:hover:bg-black/70 shadow-md"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4 text-slate-700 dark:text-white" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => {
              if (errored.has(i)) return null;
              return (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdx(i);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    i === idx
                      ? "bg-white w-3"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Image ${i + 1}`}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ── PlaceCard ── */
export interface PlaceCardProps {
  place: PlaceData;
  index?: number;
  onViewDetails?: (place: PlaceData) => void;
}

export function PlaceCard({ place, index = 0, onViewDetails }: PlaceCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { t } = useI18n();
  const config = getTypeConfig(place.type);
  const images = getImageUrls(place);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success(t("placeCard.savedToast").replace("{name}", place.name));
    }
  };

  const handleAddToTrip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdded(true);
    toast.success(t("placeCard.addedToast").replace("{name}", place.name));
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
    if (onViewDetails && !expanded) {
      onViewDetails(place);
    }
  };

  const hasDetails =
    place.address || place.duration || place.bestTime || (place.tags && place.tags.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
      className="bg-white dark:bg-[#0d2a1f] rounded-xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-default"
    >
      {/* ─── Main card: horizontal on md+, vertical on mobile ─── */}
      <div className="flex flex-col md:flex-row">
        {/* === Left: text content (60%) === */}
        <div className="flex-1 md:w-[60%] p-4 md:p-5 flex flex-col justify-between min-w-0 order-2 md:order-1">
          {/* Top section */}
          <div>
            {/* Name + rating row */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base md:text-lg text-slate-900 dark:text-white leading-tight truncate">
                  {place.name}
                </h3>
                {place.nameCn && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                    {place.nameCn}
                  </p>
                )}
              </div>
              {place.rating != null && (
                <div className="flex items-center gap-1 flex-shrink-0 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-lg">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    {place.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Type pill + area */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${config.bg} ${config.darkBg} ${config.color}`}
              >
                {config.emoji} {config.label}
              </span>
              {place.area && (
                <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                  <MapPin className="h-3 w-3" />
                  {place.area}
                </span>
              )}
              {place.price && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {place.price}
                </span>
              )}
            </div>

            {/* Description (max 3 lines) */}
            {place.desc && (
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                {place.desc}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                isLiked
                  ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-500"
                  : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-red-200 hover:text-red-500 dark:hover:border-red-500/30"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-red-500" : ""}`} />
              {isLiked ? t("placeCard.saved") : t("placeCard.save")}
            </button>
            <button
              onClick={handleAddToTrip}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                isAdded
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600"
                  : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-emerald-200 hover:text-emerald-600 dark:hover:border-emerald-500/30"
              }`}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              {isAdded ? t("placeCard.added") : t("placeCard.addToTrip")}
            </button>
            {hasDetails && (
              <button
                onClick={handleViewDetails}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                  expanded
                    ? "bg-[#6BBFAC]/10 border-[#6BBFAC]/30 text-[#6BBFAC]"
                    : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-[#6BBFAC]/30 hover:text-[#6BBFAC]"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                {expanded ? t("placeCard.hideDetails") : t("placeCard.viewDetails")}
                {expanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* === Right: image carousel (40%) === */}
        <div className="md:w-[40%] h-48 md:h-auto md:min-h-[200px] relative flex-shrink-0 order-1 md:order-2">
          <ImageCarousel
            images={images}
            fallbackGradient={config.gradient}
            fallbackEmoji={config.emoji}
            alt={place.name}
          />
        </div>
      </div>

      {/* ─── Expandable details panel ─── */}
      <AnimatePresence>
        {expanded && hasDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-5 pb-4 pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {place.address && (
                  <DetailItem
                    icon={<MapPin className="h-4 w-4 text-[#6BBFAC]" />}
                    label={t("placeCard.address")}
                    value={place.address}
                  />
                )}
                {place.duration && (
                  <DetailItem
                    icon={<Clock className="h-4 w-4 text-[#6BBFAC]" />}
                    label={t("placeCard.duration")}
                    value={place.duration}
                  />
                )}
                {place.bestTime && (
                  <DetailItem
                    icon={<Sun className="h-4 w-4 text-[#6BBFAC]" />}
                    label={t("placeCard.bestTime")}
                    value={place.bestTime}
                  />
                )}
                {place.tags && place.tags.length > 0 && (
                  <div className="sm:col-span-2 flex items-start gap-2">
                    <Tag className="h-4 w-4 text-[#6BBFAC] mt-0.5 flex-shrink-0" />
                    <div className="flex flex-wrap gap-1.5">
                      {place.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-200 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

/* ── PlaceCardsGrid ── */
export interface PlaceCardsGridProps {
  places: PlaceData[];
  onViewDetails?: (place: PlaceData) => void;
}

export function PlaceCardsGrid({ places, onViewDetails }: PlaceCardsGridProps) {
  if (!places || places.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 my-3">
      {places.map((place, i) => (
        <PlaceCard
          key={`${place.name}-${i}`}
          place={place}
          index={i}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
