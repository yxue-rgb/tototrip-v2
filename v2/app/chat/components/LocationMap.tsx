"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Location } from '@/lib/types';
import { useTheme } from '@/contexts/ThemeContext';
import dynamic from 'next/dynamic';
import { Map, List, ChevronRight, Maximize2, Minimize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then((mod) => mod.Polyline), { ssr: false });

// Day colors for map markers and polylines
const DAY_COLORS: Record<number, string> = {
  1: '#6BBFAC', // teal
  2: '#E0C4BC', // pink
  3: '#C999C5', // purple
  4: '#E7B61B', // yellow
};
const DAY_COLOR_DEFAULT = '#99B7CF'; // light blue for day 5+

function getDayColor(day: number): string {
  return DAY_COLORS[day] || DAY_COLOR_DEFAULT;
}

interface LocationMapProps {
  locations: Location[];
  height?: string;
  hoveredLocationIndex?: number | null;
  selectedDay?: number | null;
  onLocationClick?: (index: number) => void;
  onLocationHover?: (index: number | null) => void;
}

// Category config: color, icon emoji, and marker color
const categoryConfig: Record<string, { color: string; bg: string; markerColor: string; emoji: string; label: string }> = {
  restaurant: { color: '#F97316', bg: '#FFF7ED', markerColor: '#F97316', emoji: '🍜', label: 'Restaurant' },
  attraction: { color: '#E95331', bg: '#FEF2F2', markerColor: '#E95331', emoji: '🏛️', label: 'Attraction' },
  hotel: { color: '#8B5CF6', bg: '#F5F3FF', markerColor: '#8B5CF6', emoji: '🏨', label: 'Hotel' },
  transport: { color: '#3B82F6', bg: '#EFF6FF', markerColor: '#3B82F6', emoji: '🚄', label: 'Transport' },
  shopping: { color: '#EC4899', bg: '#FDF2F8', markerColor: '#EC4899', emoji: '🛍️', label: 'Shopping' },
  other: { color: '#64748B', bg: '#F8FAFC', markerColor: '#64748B', emoji: '📍', label: 'Place' },
};

// Determine which "day" a location belongs to based on its index
// Uses a simple heuristic: ~3-4 locations per day
function getLocationDay(index: number, total: number): number {
  if (total <= 4) return 1;
  const perDay = Math.ceil(total / Math.ceil(total / 3));
  return Math.floor(index / perDay) + 1;
}

// Create a custom colored SVG marker icon
function createMarkerIcon(category: string, index: number, dayColor: string, isHighlighted: boolean): any {
  if (typeof window === 'undefined') return null;
  const L = require('leaflet');
  const config = categoryConfig[category] || categoryConfig.other;
  const size = isHighlighted ? 44 : 36;
  const viewBoxH = isHighlighted ? 56 : 46;
  
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${viewBoxH}" viewBox="0 0 36 46">
      <defs>
        <filter id="shadow-${category}-${index}" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="${isHighlighted ? 3 : 2}" flood-color="rgba(0,0,0,${isHighlighted ? 0.35 : 0.25})"/>
        </filter>
      </defs>
      <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.06 27.94 0 18 0z" 
            fill="${dayColor}" filter="url(#shadow-${category}-${index})" ${isHighlighted ? 'stroke="white" stroke-width="2"' : ''}/>
      <circle cx="18" cy="17" r="11" fill="white" opacity="0.95"/>
      <text x="18" y="22" text-anchor="middle" font-size="14">${config.emoji}</text>
      <circle cx="28" cy="8" r="8" fill="#083022" stroke="white" stroke-width="1.5"/>
      <text x="28" y="12" text-anchor="middle" font-size="9" fill="white" font-weight="bold" font-family="system-ui">${index + 1}</text>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: `custom-marker-icon ${isHighlighted ? 'marker-highlighted' : ''}`,
    iconSize: [size, viewBoxH],
    iconAnchor: [size / 2, viewBoxH],
    popupAnchor: [0, -viewBoxH + 4],
  });
}

// Unsplash placeholder image for popups
function getPlaceholderImage(category: string, name: string): string {
  const queries: Record<string, string> = {
    restaurant: 'chinese+restaurant+food',
    attraction: 'china+landmark+travel',
    hotel: 'hotel+room+luxury',
    shopping: 'shopping+market+china',
    transport: 'train+station+china',
  };
  const query = queries[category] || 'china+travel';
  return `https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=400&h=200&fit=crop&q=80`;
}

// Rich popup content component
function LocationPopup({ location, index, dayColor, total }: { location: Location; index: number; dayColor: string; total: number }) {
  const config = categoryConfig[location.category] || categoryConfig.other;
  const imageUrl = location.imageUrl || getPlaceholderImage(location.category, location.name);
  
  // Extract Chinese name if embedded in location name
  const nameParts = location.name.match(/^(.*?)\s*([\u4e00-\u9fff]+.*)$/);
  const englishName = nameParts ? nameParts[1].trim() : location.name;
  const chineseName = nameParts ? nameParts[2].trim() : '';
  
  // Price display
  const priceDisplay = location.estimatedCost 
    ? `¥${location.estimatedCost}` 
    : location.priceLevel 
      ? '💰'.repeat(location.priceLevel) 
      : null;

  return (
    <div className="min-w-[260px] max-w-[320px] p-0 -m-[14px] -mb-[18px]">
      {/* Image */}
      <div className="relative h-[120px] overflow-hidden rounded-t-lg">
        <img 
          src={imageUrl} 
          alt={location.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=400&h=200&fit=crop&q=80`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {/* Day badge */}
        <span 
          className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm"
          style={{ background: dayColor }}
        >
          Day {getLocationDay(index, total)}
        </span>
        {/* Number badge */}
        <span 
          className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-[#083022] shadow-sm"
        >
          #{index + 1}
        </span>
        {/* Category icon */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
          <span className="text-sm">{config.emoji}</span>
          <span className="text-[10px] font-medium text-white/90 uppercase tracking-wider">{config.label}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 py-3">
        <div className="mb-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight">{englishName}</h3>
          {chineseName && (
            <p className="text-xs text-slate-400 mt-0.5">{chineseName}</p>
          )}
        </div>
        
        {/* Rating + Price row */}
        <div className="flex items-center gap-3 text-xs mb-2">
          {location.rating && (
            <span className="flex items-center gap-1">
              <span className="text-amber-400">⭐</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{location.rating.toFixed(1)}</span>
              {location.reviewCount && (
                <span className="text-slate-400">({location.reviewCount.toLocaleString()})</span>
              )}
            </span>
          )}
          {priceDisplay && (
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{priceDisplay}</span>
          )}
          {location.visitDuration && (
            <span className="text-slate-400">⏱ {location.visitDuration}</span>
          )}
        </div>
        
        {/* Description */}
        {location.description && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">{location.description}</p>
        )}
        
        {location.address && (
          <p className="text-[10px] text-slate-400 truncate">📍 {location.address}</p>
        )}
        
        {/* Tags */}
        {location.tags && location.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {location.tags.slice(0, 3).map((tag, i) => (
              <span 
                key={i} 
                className="text-[9px] px-1.5 py-0.5 rounded-md"
                style={{ background: `${dayColor}20`, color: dayColor }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// List view item
function LocationListItem({ location, index, dayColor, isHighlighted, onClick, onHover }: { 
  location: Location; index: number; dayColor: string; isHighlighted: boolean; 
  onClick?: () => void; onHover?: (hovered: boolean) => void;
}) {
  const config = categoryConfig[location.category] || categoryConfig.other;
  
  return (
    <div 
      className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group ${
        isHighlighted 
          ? 'bg-[#6BBFAC]/10 dark:bg-[#6BBFAC]/5 ring-1 ring-[#6BBFAC]/30' 
          : 'hover:bg-slate-50 dark:hover:bg-white/5'
      }`}
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      {/* Number badge with day color */}
      <div 
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm"
        style={{ background: dayColor }}
      >
        {index + 1}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm">{config.emoji}</span>
          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{location.name}</h4>
        </div>
        {location.address && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mb-1">{location.address}</p>
        )}
        <div className="flex items-center gap-2.5 text-[11px]">
          {location.rating && (
            <span className="flex items-center gap-0.5">
              <span className="text-amber-400">⭐</span>
              <span className="font-medium text-slate-600 dark:text-slate-400">{location.rating.toFixed(1)}</span>
            </span>
          )}
          {location.estimatedCost && (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">¥{location.estimatedCost}</span>
          )}
          {location.visitDuration && (
            <span className="text-slate-400 dark:text-slate-500">⏱ {location.visitDuration}</span>
          )}
        </div>
      </div>
      
      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-400 flex-shrink-0 mt-2 transition-colors" />
    </div>
  );
}

// Group locations by day and draw colored polylines
function DayPolylines({ locations }: { locations: Location[] }) {
  const validLocations = locations.filter(l => l.latitude && l.longitude);
  if (validLocations.length < 2) return null;
  
  // Group into day segments
  const segments: { positions: [number, number][]; color: string }[] = [];
  const total = validLocations.length;
  
  for (let i = 0; i < validLocations.length - 1; i++) {
    const day = getLocationDay(i, total);
    const color = getDayColor(day);
    const pos: [number, number][] = [
      [validLocations[i].latitude!, validLocations[i].longitude!],
      [validLocations[i + 1].latitude!, validLocations[i + 1].longitude!],
    ];
    segments.push({ positions: pos, color });
  }
  
  return (
    <>
      {segments.map((seg, i) => (
        <Polyline
          key={i}
          positions={seg.positions}
          pathOptions={{
            color: seg.color,
            weight: 3,
            opacity: 0.6,
            dashArray: '8, 12',
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      ))}
    </>
  );
}

export function LocationMap({ 
  locations, 
  height = '400px', 
  hoveredLocationIndex = null,
  selectedDay = null,
  onLocationClick,
  onLocationHover,
}: LocationMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.9042, 116.4074]);
  const [mapZoom, setMapZoom] = useState(10);
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [icons, setIcons] = useState<Record<string, any>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const validLocations = useMemo(
    () => locations.filter(l => l.latitude && l.longitude),
    [locations]
  );

  // Filter by selected day if provided
  const displayLocations = useMemo(() => {
    if (selectedDay === null || selectedDay === undefined) return validLocations;
    return validLocations.filter((_, i) => getLocationDay(i, validLocations.length) === selectedDay);
  }, [validLocations, selectedDay]);

  // Create icons on client side
  useEffect(() => {
    if (!isClient) return;
    const newIcons: Record<string, any> = {};
    displayLocations.forEach((loc, index) => {
      const globalIndex = validLocations.indexOf(loc);
      const day = getLocationDay(globalIndex, validLocations.length);
      const dayColor = getDayColor(day);
      const isHighlighted = hoveredLocationIndex === globalIndex;
      const icon = createMarkerIcon(loc.category, globalIndex, dayColor, isHighlighted);
      if (icon) {
        newIcons[`${loc.id}-${globalIndex}-${isHighlighted}`] = icon;
      }
    });
    setIcons(newIcons);
  }, [isClient, displayLocations, hoveredLocationIndex, validLocations]);

  useEffect(() => {
    if (displayLocations.length > 0) {
      const avgLat = displayLocations.reduce((s, l) => s + (l.latitude || 0), 0) / displayLocations.length;
      const avgLng = displayLocations.reduce((s, l) => s + (l.longitude || 0), 0) / displayLocations.length;
      setMapCenter([avgLat, avgLng]);
      
      if (displayLocations.length === 1) {
        setMapZoom(14);
      } else {
        const lats = displayLocations.map(l => l.latitude!);
        const lngs = displayLocations.map(l => l.longitude!);
        const latSpan = Math.max(...lats) - Math.min(...lats);
        const lngSpan = Math.max(...lngs) - Math.min(...lngs);
        const maxSpan = Math.max(latSpan, lngSpan);
        
        if (maxSpan > 5) setMapZoom(6);
        else if (maxSpan > 2) setMapZoom(8);
        else if (maxSpan > 0.5) setMapZoom(10);
        else if (maxSpan > 0.1) setMapZoom(12);
        else setMapZoom(13);
      }
    }
  }, [displayLocations]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Close fullscreen on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  if (validLocations.length === 0 || !isClient) return null;

  // Day legend data
  const totalLocs = validLocations.length;
  const dayCount = Math.ceil(totalLocs / Math.max(Math.ceil(totalLocs / 3), 1));
  const dayLegend = Array.from({ length: Math.min(dayCount, 5) }, (_, i) => ({
    day: i + 1,
    color: getDayColor(i + 1),
  }));

  const mapHeight = isFullscreen ? '100vh' : height;

  return (
    <AnimatePresence>
      <motion.div 
        ref={containerRef}
        layout
        className={`w-full rounded-2xl overflow-hidden shadow-soft border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d2a1f] ${
          isFullscreen ? 'fixed inset-0 z-[9999] rounded-none' : ''
        }`} 
        style={{ height: mapHeight }}
      >
        {/* View toggle header */}
        <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-[#0d2a1f] border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {displayLocations.length} location{displayLocations.length !== 1 ? 's' : ''}
            </span>
            {displayLocations.length > 1 && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500">• route view</span>
            )}
            {/* Day legend pills */}
            {dayLegend.length > 1 && (
              <div className="hidden sm:flex items-center gap-1 ml-2">
                {dayLegend.map(d => (
                  <span 
                    key={d.day} 
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                    style={{ background: d.color }}
                  >
                    D{d.day}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-slate-100 dark:bg-white/10 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
                  viewMode === 'map'
                    ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                <Map className="h-3 w-3" />
                Map
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                <List className="h-3 w-3" />
                List
              </button>
            </div>
            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              aria-label={isFullscreen ? 'Exit fullscreen map' : 'View map fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Map view */}
        {viewMode === 'map' && (
          <div style={{ height: `calc(${mapHeight} - 40px)` }}>
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              ref={mapRef}
            >
              <TileLayer
                key={resolvedTheme}
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                url={resolvedTheme === 'dark'
                  ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                }
              />
              
              {/* Day-colored polylines */}
              <DayPolylines locations={displayLocations} />
              
              {/* Custom markers */}
              {displayLocations.map((location) => {
                const globalIndex = validLocations.indexOf(location);
                const day = getLocationDay(globalIndex, validLocations.length);
                const dayColor = getDayColor(day);
                const isHighlighted = hoveredLocationIndex === globalIndex;
                const iconKey = `${location.id}-${globalIndex}-${isHighlighted}`;
                const icon = icons[iconKey];
                if (!icon) return null;
                
                return (
                  <Marker
                    key={location.id}
                    position={[location.latitude!, location.longitude!]}
                    icon={icon}
                    eventHandlers={{
                      click: () => onLocationClick?.(globalIndex),
                      mouseover: () => onLocationHover?.(globalIndex),
                      mouseout: () => onLocationHover?.(null),
                    }}
                  >
                    <Popup 
                      maxWidth={340}
                      minWidth={260}
                      closeButton={true}
                      className="custom-popup"
                    >
                      <LocationPopup location={location} index={globalIndex} dayColor={dayColor} total={validLocations.length} />
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        )}

        {/* List view */}
        {viewMode === 'list' && (
          <div 
            className="overflow-y-auto"
            style={{ height: `calc(${mapHeight} - 40px)` }}
          >
            <div className="p-2 pb-4 space-y-0.5">
              {displayLocations.map((location, idx) => {
                const globalIndex = validLocations.indexOf(location);
                const day = getLocationDay(globalIndex, validLocations.length);
                const dayColor = getDayColor(day);
                return (
                  <div key={location.id}>
                    <LocationListItem 
                      location={location} 
                      index={globalIndex} 
                      dayColor={dayColor}
                      isHighlighted={hoveredLocationIndex === globalIndex}
                      onClick={() => onLocationClick?.(globalIndex)}
                      onHover={(hovered) => onLocationHover?.(hovered ? globalIndex : null)}
                    />
                    {idx < displayLocations.length - 1 && (
                      <div className="flex items-center gap-3 px-3 py-0.5">
                        <div className="w-8 flex justify-center">
                          <div className="w-0.5 h-4 rounded-full" style={{ 
                            background: `linear-gradient(to bottom, ${dayColor}40, ${getDayColor(getLocationDay(globalIndex + 1, validLocations.length))}40)` 
                          }} />
                        </div>
                        <div className="flex-1 border-b border-dashed border-slate-100 dark:border-white/5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
