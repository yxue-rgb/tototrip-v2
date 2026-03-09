"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Location } from "@/lib/types";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic imports for SSR safety
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

// ──────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────

const DAY_COLORS: Record<number, string> = {
  1: "#6BBFAC", // teal
  2: "#E0C4BC", // pink
  3: "#C999C5", // purple
  4: "#E7B61B", // yellow
};
const DAY_COLOR_DEFAULT = "#99B7CF"; // light blue for day 5+

function getDayColor(day: number): string {
  return DAY_COLORS[day] || DAY_COLOR_DEFAULT;
}

const categoryConfig: Record<
  string,
  { emoji: string; color: string; label: string }
> = {
  restaurant: { emoji: "🍜", color: "#F97316", label: "Restaurant" },
  attraction: { emoji: "🏛️", color: "#E95331", label: "Attraction" },
  hotel: { emoji: "🏨", color: "#8B5CF6", label: "Hotel" },
  transport: { emoji: "🚄", color: "#3B82F6", label: "Transport" },
  shopping: { emoji: "🛍️", color: "#EC4899", label: "Shopping" },
  other: { emoji: "📍", color: "#64748B", label: "Place" },
};

// Heuristic: ~3-4 locations per day
function getLocationDay(index: number, total: number): number {
  if (total <= 4) return 1;
  const perDay = Math.ceil(total / Math.ceil(total / 3));
  return Math.floor(index / perDay) + 1;
}

// ──────────────────────────────────────────────────
// Marker Icon
// ──────────────────────────────────────────────────

function createMarkerIcon(
  category: string,
  index: number,
  dayColor: string,
  isSelected: boolean,
  isHovered: boolean
): any {
  if (typeof window === "undefined") return null;
  const L = require("leaflet");
  const config = categoryConfig[category] || categoryConfig.other;
  const active = isSelected || isHovered;
  const size = active ? 46 : 38;
  const viewBoxH = active ? 58 : 48;

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${viewBoxH}" viewBox="0 0 38 48"
         style="transition:transform 0.2s ease;${active ? "transform:scale(1.1);" : ""}">
      <defs>
        <filter id="ms${index}${active ? "a" : ""}" x="-25%" y="-15%" width="150%" height="140%">
          <feDropShadow dx="0" dy="${active ? 3 : 2}" stdDeviation="${active ? 4 : 2.5}" 
                        flood-color="rgba(0,0,0,${active ? 0.4 : 0.25})"/>
        </filter>
      </defs>
      <path d="M19 0C8.51 0 0 8.51 0 19c0 14.25 19 29 19 29s19-14.75 19-29C38 8.51 29.49 0 19 0z" 
            fill="${dayColor}" filter="url(#ms${index}${active ? "a" : ""})"
            ${active ? 'stroke="white" stroke-width="2.5"' : 'stroke="white" stroke-width="1"'}/>
      <circle cx="19" cy="18" r="12" fill="white" opacity="0.95"/>
      <text x="19" y="23" text-anchor="middle" font-size="14">${config.emoji}</text>
      <circle cx="30" cy="8" r="8.5" fill="#083022" stroke="white" stroke-width="1.5"/>
      <text x="30" y="12" text-anchor="middle" font-size="9" fill="white" font-weight="bold" font-family="system-ui,-apple-system,sans-serif">${index + 1}</text>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: `tototrip-marker ${active ? "tototrip-marker-active" : ""}`,
    iconSize: [size, viewBoxH],
    iconAnchor: [size / 2, viewBoxH],
    popupAnchor: [0, -viewBoxH + 6],
  });
}

// ──────────────────────────────────────────────────
// Rich Popup Content
// ──────────────────────────────────────────────────

function RichPopupContent({
  location,
  index,
  dayColor,
  total,
  onViewDetails,
  onSave,
}: {
  location: Location;
  index: number;
  dayColor: string;
  total: number;
  onViewDetails?: (location: Location) => void;
  onSave?: (location: Location) => void;
}) {
  const config = categoryConfig[location.category] || categoryConfig.other;
  const hasImage = !!(location.imageUrl || (location.images && location.images.length > 0));
  const imageUrl = location.imageUrl || (location.images && location.images[0]);

  const priceDisplay = location.estimatedCost
    ? `¥${location.estimatedCost}`
    : location.priceLevel
    ? "💰".repeat(location.priceLevel)
    : null;

  const dayNum = getLocationDay(index, total);

  return (
    <div className="tototrip-rich-popup">
      {/* Image or gradient placeholder */}
      <div className="tototrip-popup-image">
        {hasImage ? (
          <img
            src={imageUrl}
            alt={location.name}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) parent.classList.add("tototrip-popup-image-fallback");
            }}
          />
        ) : (
          <div
            className="tototrip-popup-image-fallback"
            style={{
              background: `linear-gradient(135deg, ${dayColor}, ${config.color})`,
            }}
          >
            <span className="tototrip-popup-image-emoji">{config.emoji}</span>
          </div>
        )}
        <div className="tototrip-popup-image-overlay" />
        {/* Day badge */}
        <span
          className="tototrip-popup-day-badge"
          style={{ background: dayColor }}
        >
          Day {dayNum}
        </span>
        {/* Number badge */}
        <span className="tototrip-popup-num-badge">#{index + 1}</span>
      </div>

      {/* Content */}
      <div className="tototrip-popup-content">
        {/* Name + category pill */}
        <div className="tototrip-popup-header">
          <h3 className="tototrip-popup-name">{location.name}</h3>
          <span
            className="tototrip-popup-category-pill"
            style={{
              background: `${config.color}18`,
              color: config.color,
              borderColor: `${config.color}30`,
            }}
          >
            {config.emoji} {config.label}
          </span>
        </div>

        {/* Rating + review count */}
        {location.rating && (
          <div className="tototrip-popup-rating-row">
            <span className="tototrip-popup-stars">
              {"★".repeat(Math.round(location.rating))}
              {"☆".repeat(5 - Math.round(location.rating))}
            </span>
            <span className="tototrip-popup-rating-num">
              {location.rating.toFixed(1)}
            </span>
            {location.reviewCount && (
              <span className="tototrip-popup-review-count">
                ({location.reviewCount.toLocaleString()} reviews)
              </span>
            )}
          </div>
        )}

        {/* Address */}
        {location.address && (
          <p className="tototrip-popup-address">📍 {location.address}</p>
        )}

        {/* Description */}
        {location.description && (
          <p className="tototrip-popup-desc">{location.description}</p>
        )}

        {/* Meta row: price + duration */}
        <div className="tototrip-popup-meta">
          {priceDisplay && (
            <span className="tototrip-popup-price">💰 {priceDisplay}</span>
          )}
          {location.visitDuration && (
            <span className="tototrip-popup-duration">
              🕐 {location.visitDuration}
            </span>
          )}
        </div>

        {/* Tags */}
        {location.tags && location.tags.length > 0 && (
          <div className="tototrip-popup-tags">
            {location.tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="tototrip-popup-tag"
                style={{
                  background: `${dayColor}18`,
                  color: dayColor,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="tototrip-popup-actions">
          <button
            className="tototrip-popup-btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(location);
            }}
          >
            View Details
          </button>
          <button
            className="tototrip-popup-btn-save"
            onClick={(e) => {
              e.stopPropagation();
              onSave?.(location);
            }}
          >
            ❤️ Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
// Polyline Arrows (day-colored route)
// ──────────────────────────────────────────────────

function DayPolylines({
  locations,
  totalLocations,
}: {
  locations: Location[];
  totalLocations: number;
}) {
  const valid = locations.filter((l) => l.latitude && l.longitude);
  if (valid.length < 2) return null;

  const segments: {
    positions: [number, number][];
    color: string;
  }[] = [];

  for (let i = 0; i < valid.length - 1; i++) {
    const day = getLocationDay(i, totalLocations);
    segments.push({
      positions: [
        [valid[i].latitude!, valid[i].longitude!],
        [valid[i + 1].latitude!, valid[i + 1].longitude!],
      ],
      color: getDayColor(day),
    });
  }

  return (
    <>
      {segments.map((seg, i) => (
        <Polyline
          key={`route-${i}`}
          positions={seg.positions}
          pathOptions={{
            color: seg.color,
            weight: 3,
            opacity: 0.55,
            dashArray: "8, 12",
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      ))}
    </>
  );
}

// ──────────────────────────────────────────────────
// Main MapPanel Component
// ──────────────────────────────────────────────────

interface MapPanelProps {
  locations: Location[];
  flyToTrigger: number;
  selectedLocationId?: string | null;
  onViewDetails?: (location: Location) => void;
  onSaveLocation?: (location: Location) => void;
  className?: string;
}

export function MapPanel({
  locations,
  flyToTrigger,
  selectedLocationId = null,
  onViewDetails,
  onSaveLocation,
  className = "",
}: MapPanelProps) {
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const prevTriggerRef = useRef(flyToTrigger);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // null = all
  const [icons, setIcons] = useState<Record<string, any>>({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  const validLocations = useMemo(
    () => locations.filter((l) => l.latitude && l.longitude),
    [locations]
  );

  // Compute day count for filter pills
  const dayCount = useMemo(() => {
    if (validLocations.length === 0) return 0;
    const total = validLocations.length;
    let maxDay = 1;
    for (let i = 0; i < total; i++) {
      const d = getLocationDay(i, total);
      if (d > maxDay) maxDay = d;
    }
    return maxDay;
  }, [validLocations]);

  // Filter by selected day
  const displayLocations = useMemo(() => {
    if (selectedDay === null) return validLocations;
    return validLocations.filter(
      (_, i) => getLocationDay(i, validLocations.length) === selectedDay
    );
  }, [validLocations, selectedDay]);

  // Build icons whenever display changes
  useEffect(() => {
    if (!isClient) return;
    const newIcons: Record<string, any> = {};
    displayLocations.forEach((loc) => {
      const globalIndex = validLocations.indexOf(loc);
      const day = getLocationDay(globalIndex, validLocations.length);
      const dayColor = getDayColor(day);
      const isSelected = selectedLocationId === loc.id;
      const isHovered = hoveredId === loc.id;
      const key = `${loc.id}-${isSelected}-${isHovered}`;
      const icon = createMarkerIcon(
        loc.category,
        globalIndex,
        dayColor,
        isSelected,
        isHovered
      );
      if (icon) newIcons[key] = icon;
    });
    setIcons(newIcons);
  }, [isClient, displayLocations, validLocations, selectedLocationId, hoveredId]);

  // Fly to locations on trigger
  useEffect(() => {
    if (!isClient || !mapRef.current) return;
    if (prevTriggerRef.current === flyToTrigger && flyToTrigger === 0) return;
    prevTriggerRef.current = flyToTrigger;

    const valid = locations.filter((l) => l.latitude && l.longitude);
    if (valid.length === 0) return;

    const map = mapRef.current;

    if (valid.length === 1) {
      map.flyTo([valid[0].latitude!, valid[0].longitude!], 13, {
        duration: 1.5,
      });
    } else {
      const L = require("leaflet");
      const bounds = L.latLngBounds(
        valid.map((l) => [l.latitude!, l.longitude!])
      );
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    }
  }, [flyToTrigger, locations, isClient]);

  // Open popup for selected location
  useEffect(() => {
    if (!isClient || !mapRef.current || !selectedLocationId) return;

    const loc = validLocations.find((l) => l.id === selectedLocationId);
    if (!loc) return;

    const map = mapRef.current;
    map.flyTo([loc.latitude!, loc.longitude!], 14, { duration: 1.2 });

    // Open the popup after fly completes
    setTimeout(() => {
      const markerRef = markersRef.current[loc.id];
      if (markerRef) {
        markerRef.openPopup();
      }
    }, 1300);
  }, [selectedLocationId, isClient, validLocations]);

  if (!isClient) {
    return (
      <div
        className={`bg-gray-100 dark:bg-[#0a1a13] animate-pulse flex items-center justify-center ${className}`}
      >
        <span className="text-gray-400 dark:text-gray-600 text-sm">
          Loading map...
        </span>
      </div>
    );
  }

  return (
    <div className={`relative h-full ${className}`}>
      {/* Inject scoped styles for popups and markers */}
      <style jsx global>{`
        /* ── Marker transitions ── */
        .tototrip-marker {
          background: transparent !important;
          border: none !important;
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        .tototrip-marker-active {
          z-index: 1000 !important;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
        }

        /* ── Rich Popup ── */
        .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          padding: 0 !important;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15),
            0 2px 8px rgba(0, 0, 0, 0.08) !important;
          border: 1px solid rgba(0, 0, 0, 0.06) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: 290px !important;
        }
        .leaflet-popup-tip {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }
        .leaflet-popup-close-button {
          z-index: 10 !important;
          color: white !important;
          font-size: 20px !important;
          padding: 6px 8px !important;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }

        .tototrip-rich-popup {
          font-family: system-ui, -apple-system, sans-serif;
        }

        .tototrip-popup-image {
          position: relative;
          height: 120px;
          overflow: hidden;
          background: linear-gradient(135deg, #6BBFAC, #083022);
        }
        .tototrip-popup-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .tototrip-popup-image-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        .tototrip-popup-image-emoji {
          font-size: 40px;
          opacity: 0.7;
        }
        .tototrip-popup-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent 60%);
          pointer-events: none;
        }
        .tototrip-popup-day-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        .tototrip-popup-num-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
          color: white;
          background: #083022;
        }

        .tototrip-popup-content {
          padding: 12px 14px 14px;
        }

        .tototrip-popup-header {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }
        .tototrip-popup-name {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
          line-height: 1.3;
          flex: 1;
          min-width: 0;
        }
        .tototrip-popup-category-pill {
          font-size: 10px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
          border: 1px solid;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .tototrip-popup-rating-row {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 6px;
          font-size: 11px;
        }
        .tototrip-popup-stars {
          color: #f59e0b;
          letter-spacing: 1px;
          font-size: 11px;
        }
        .tototrip-popup-rating-num {
          font-weight: 700;
          color: #334155;
        }
        .tototrip-popup-review-count {
          color: #94a3b8;
          font-size: 10px;
        }

        .tototrip-popup-address {
          font-size: 11px;
          color: #64748b;
          margin: 0 0 6px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tototrip-popup-desc {
          font-size: 11px;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tototrip-popup-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
          font-size: 11px;
        }
        .tototrip-popup-price {
          font-weight: 700;
          color: #059669;
        }
        .tototrip-popup-duration {
          color: #64748b;
        }

        .tototrip-popup-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 10px;
        }
        .tototrip-popup-tag {
          font-size: 9px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 6px;
        }

        .tototrip-popup-actions {
          display: flex;
          gap: 8px;
        }
        .tototrip-popup-btn-primary {
          flex: 1;
          background: #083022;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 7px 0;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .tototrip-popup-btn-primary:hover {
          background: #0d4a35;
        }
        .tototrip-popup-btn-save {
          background: #fef2f2;
          color: #ef4444;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .tototrip-popup-btn-save:hover {
          background: #fee2e2;
        }

        /* ── Dark mode overrides ── */
        .dark .leaflet-popup-content-wrapper {
          background: #0d2a1f !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .dark .leaflet-popup-tip {
          background: #0d2a1f !important;
        }
        .dark .tototrip-popup-name {
          color: #f1f5f9;
        }
        .dark .tototrip-popup-rating-num {
          color: #cbd5e1;
        }
        .dark .tototrip-popup-address {
          color: #94a3b8;
        }
        .dark .tototrip-popup-desc {
          color: #94a3b8;
        }
        .dark .tototrip-popup-price {
          color: #34d399;
        }
        .dark .tototrip-popup-duration {
          color: #94a3b8;
        }
        .dark .tototrip-popup-btn-primary {
          background: #6BBFAC;
          color: #083022;
        }
        .dark .tototrip-popup-btn-primary:hover {
          background: #5aae9b;
        }
        .dark .tototrip-popup-btn-save {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.2);
          color: #f87171;
        }

        /* ── Day filter pills ── */
        .tototrip-day-pills {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .tototrip-day-pill {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          border: 1.5px solid;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .tototrip-day-pill:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .dark .tototrip-day-pill {
          background: #0d2a1f;
        }

        /* Mobile popup sizing */
        @media (max-width: 640px) {
          .leaflet-popup-content {
            width: 260px !important;
          }
          .tototrip-popup-image {
            height: 100px;
          }
        }
      `}</style>

      <MapContainer
        center={[35.86, 104.19]}
        zoom={4}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        ref={mapRef}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Day-colored polylines */}
        <DayPolylines
          locations={displayLocations}
          totalLocations={validLocations.length}
        />

        {/* Markers */}
        {displayLocations.map((location) => {
          const globalIndex = validLocations.indexOf(location);
          const day = getLocationDay(globalIndex, validLocations.length);
          const dayColor = getDayColor(day);
          const isSelected = selectedLocationId === location.id;
          const isHovered = hoveredId === location.id;
          const iconKey = `${location.id}-${isSelected}-${isHovered}`;
          const icon = icons[iconKey];
          if (!icon) return null;

          return (
            <Marker
              key={location.id}
              position={[location.latitude!, location.longitude!]}
              icon={icon}
              ref={(ref: any) => {
                if (ref) markersRef.current[location.id] = ref;
              }}
              eventHandlers={{
                mouseover: () => setHoveredId(location.id),
                mouseout: () => setHoveredId(null),
              }}
            >
              <Popup
                maxWidth={320}
                minWidth={260}
                closeButton={true}
                className="tototrip-custom-popup"
              >
                <RichPopupContent
                  location={location}
                  index={globalIndex}
                  dayColor={dayColor}
                  total={validLocations.length}
                  onViewDetails={onViewDetails}
                  onSave={onSaveLocation}
                />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* ── Overlay Controls ── */}

      {/* Location count badge — top left */}
      {validLocations.length > 0 && (
        <div className="absolute top-3 left-3 z-[1000] bg-white/95 dark:bg-[#0d2a1f]/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md border border-gray-200/50 dark:border-white/10">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            📍 {validLocations.length} location
            {validLocations.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Day filter pills — top center */}
      {dayCount > 1 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 dark:bg-[#0d2a1f]/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-gray-200/50 dark:border-white/10">
          <div className="tototrip-day-pills">
            <button
              className="tototrip-day-pill"
              style={{
                borderColor:
                  selectedDay === null ? "#083022" : "rgba(0,0,0,0.12)",
                background:
                  selectedDay === null ? "#083022" : undefined,
                color: selectedDay === null ? "white" : "#64748b",
              }}
              onClick={() => setSelectedDay(null)}
            >
              All
            </button>
            {Array.from({ length: Math.min(dayCount, 7) }, (_, i) => i + 1).map(
              (day) => {
                const c = getDayColor(day);
                const active = selectedDay === day;
                return (
                  <button
                    key={day}
                    className="tototrip-day-pill"
                    style={{
                      borderColor: active ? c : "rgba(0,0,0,0.12)",
                      background: active ? c : undefined,
                      color: active ? "white" : "#64748b",
                    }}
                    onClick={() =>
                      setSelectedDay(active ? null : day)
                    }
                  >
                    Day {day}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}
