"use client";

import { Location } from "@/lib/types";
import { MapPin, Star, Clock, DollarSign, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface LocationCardProps {
  location: Location;
  onClick?: () => void;
}

export function LocationCard({ location, onClick }: LocationCardProps) {
  const priceSymbols = location.priceLevel
    ? "$".repeat(location.priceLevel)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-gray-100"
      onClick={onClick}
    >
      {/* Image */}
      {location.imageUrl && (
        <div className="relative h-40 w-full bg-gray-200">
          <Image
            src={location.imageUrl}
            alt={location.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title and Category */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 flex-1">
            {location.name}
          </h3>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full ml-2 whitespace-nowrap">
            {location.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {location.description}
        </p>

        {/* Details Grid */}
        <div className="space-y-2">
          {/* Rating */}
          {location.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{location.rating.toFixed(1)}</span>
              {location.reviewCount && (
                <span className="text-gray-500">({location.reviewCount})</span>
              )}
            </div>
          )}

          {/* Address */}
          {location.address && (
            <div className="flex items-start gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{location.address}</span>
            </div>
          )}

          {/* Duration */}
          {location.visitDuration && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{location.visitDuration}</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {priceSymbols && (
              <div className="flex items-center gap-1 text-sm">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-600">
                  {priceSymbols}
                </span>
              </div>
            )}

            {location.estimatedCost && (
              <div className="text-sm font-semibold text-gray-900">
                {location.currency || '¥'}{location.estimatedCost}
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {location.tags && location.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {location.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function LocationsGrid({ locations, onLocationClick }: {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
}) {
  if (!locations || locations.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
          onClick={() => onLocationClick?.(location)}
        />
      ))}
    </div>
  );
}
