"use client";

import { Location } from "@/lib/types";
import { MapPin, Star, Clock, Bookmark, Check, Heart, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

interface LocationCardProps {
  location: Location;
  onClick?: () => void;
  onSave?: (location: Location) => Promise<void>;
  showSaveButton?: boolean;
}

export function LocationCard({ location, onClick, onSave, showSaveButton = false }: LocationCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const categoryConfig: Record<string, { color: string; bg: string; border: string; emoji: string; gradient: string }> = {
    restaurant: { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", emoji: "🍜", gradient: "from-orange-400 to-amber-500" },
    attraction: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", emoji: "🏛️", gradient: "from-blue-400 to-indigo-500" },
    hotel: { color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", emoji: "🏨", gradient: "from-purple-400 to-violet-500" },
    shopping: { color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200", emoji: "🛍️", gradient: "from-pink-400 to-rose-500" },
    transport: { color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200", emoji: "🚄", gradient: "from-cyan-400 to-blue-500" },
    other: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", emoji: "📍", gradient: "from-emerald-400 to-teal-500" },
  };

  const cat = categoryConfig[location.category] || categoryConfig.other;

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved || !onSave) return;
    setIsSaving(true);
    try {
      await onSave(location);
      setIsSaved(true);
    } catch (error) {
      console.error('Failed to save location:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Star rating visualization
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-amber-400">⭐</span>);
      } else if (i === fullStars && hasHalf) {
        stars.push(<span key={i} className="text-amber-400 opacity-60">⭐</span>);
      }
    }
    return stars;
  };

  // Price level display
  const renderPrice = (priceLevel?: 1 | 2 | 3 | 4) => {
    if (!priceLevel) return null;
    return (
      <span className="text-xs font-medium text-emerald-600">
        {"💰".repeat(priceLevel)}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-[#0d2a1f] rounded-xl overflow-hidden cursor-pointer border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-lg transition-all duration-200"
      onClick={onClick}
    >
      {/* Image / Category Header */}
      <div className="relative h-28 overflow-hidden">
        {location.imageUrl ? (
          <Image
            src={location.imageUrl}
            alt={`${location.name} - ${location.category} in ${location.city || 'China'}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className={`h-full bg-gradient-to-br ${cat.gradient} flex items-center justify-center`}>
            <span className="text-4xl opacity-80">{cat.emoji}</span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm ${cat.color} shadow-sm`}>
            {cat.emoji} {location.category}
          </span>
        </div>
        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className="absolute top-1 right-1 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5">
        {/* Title row */}
        <div className="flex items-start justify-between mb-1.5 gap-2">
          <h3 className="font-bold text-sm text-gray-900 dark:text-slate-100 truncate flex-1">{location.name}</h3>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-slate-400 mb-2.5 line-clamp-2 leading-relaxed">{location.description}</p>

        {/* Rating & price row */}
        <div className="flex items-center gap-2 mb-2">
          {location.rating && (
            <div className="flex items-center gap-1 text-xs">
              <div className="flex items-center gap-0.5 text-[10px]">
                {renderStars(location.rating)}
              </div>
              <span className="font-semibold text-gray-800 dark:text-slate-200">{location.rating.toFixed(1)}</span>
              {location.reviewCount && <span className="text-gray-400 dark:text-slate-500">({location.reviewCount.toLocaleString()})</span>}
            </div>
          )}
          {renderPrice(location.priceLevel)}
        </div>

        {/* Details */}
        <div className="space-y-1">
          {location.address && (
            <div className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-slate-400">
              <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0 text-[#6BBFAC]" />
              <span className="line-clamp-1">{location.address}</span>
            </div>
          )}

          {location.visitDuration && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
              <Clock className="h-3 w-3 text-blue-400" />
              <span>{location.visitDuration}</span>
            </div>
          )}
        </div>

        {/* Cost & Tags */}
        <div className="flex items-center flex-wrap gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-white/10">
          {location.estimatedCost && (
            <div className="text-xs font-bold text-[#1a4a3a] dark:text-[#6BBFAC]">
              ¥{location.estimatedCost}
            </div>
          )}
          {location.tags && location.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {location.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-slate-400 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        {showSaveButton && (
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-white/10">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isSaving || isSaved}
              className={`h-7 text-[11px] rounded-lg flex-1 ${
                isSaved
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "hover:bg-[#1a4a3a]/5 hover:text-[#1a4a3a] hover:border-[#1a4a3a]/30"
              }`}
            >
              {isSaved ? (
                <><Check className="h-3 w-3 mr-1" /> Saved</>
              ) : (
                <><Bookmark className="h-3 w-3 mr-1" /> ❤️ Save</>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] rounded-lg flex-1 hover:bg-[#1a4a3a]/5 hover:text-[#1a4a3a] hover:border-[#1a4a3a]/30"
              onClick={(e) => {
                e.stopPropagation();
                if (onSave) onSave(location);
              }}
            >
              <PlusCircle className="h-3 w-3 mr-1" /> ➕ Add to Trip
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function LocationsGrid({ locations, onLocationClick, onSave, showSaveButton }: {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
  onSave?: (location: Location) => Promise<void>;
  showSaveButton?: boolean;
}) {
  if (!locations || locations.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
          onClick={() => onLocationClick?.(location)}
          onSave={onSave}
          showSaveButton={showSaveButton}
        />
      ))}
    </div>
  );
}
