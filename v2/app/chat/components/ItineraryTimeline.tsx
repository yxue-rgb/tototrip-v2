"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  MapPin,
  Clock,
  Bus,
  UtensilsCrossed,
  Camera,
  Hotel,
  ShoppingBag,
  Train,
  Footprints,
  Sun,
  Sunset,
  Moon,
  Globe,
} from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import type { Itinerary, ItineraryDay, ItineraryItem } from "@/lib/parseItinerary";

interface ItineraryTimelineProps {
  itinerary: Itinerary;
  onDaySelect?: (day: number | null) => void;
}

// Day colors matching LocationMap
const DAY_COLORS: Record<number, string> = {
  1: '#6BBFAC',
  2: '#E0C4BC',
  3: '#C999C5',
  4: '#E7B61B',
};
const DAY_COLOR_DEFAULT = '#99B7CF';

function getDayColor(day: number): string {
  return DAY_COLORS[day] || DAY_COLOR_DEFAULT;
}

const CATEGORY_CONFIG: Record<string, { icon: typeof MapPin; color: string }> = {
  attraction: { icon: Camera, color: "#E95331" },
  restaurant: { icon: UtensilsCrossed, color: "#E7B61B" },
  hotel: { icon: Hotel, color: "#C999C5" },
  shopping: { icon: ShoppingBag, color: "#9E552D" },
  transport: { icon: Train, color: "#99B7CF" },
  other: { icon: MapPin, color: "#6BBFAC" },
};

const TIME_CONFIG: Record<string, { icon: typeof Sun; labelKey: string; emoji: string }> = {
  Morning: { icon: Sun, labelKey: "itinerary.morning", emoji: "🌅" },
  Afternoon: { icon: Sunset, labelKey: "itinerary.afternoon", emoji: "☀️" },
  Evening: { icon: Moon, labelKey: "itinerary.evening", emoji: "🌙" },
};

function getCategoryConfig(category?: string) {
  if (!category) return CATEGORY_CONFIG.other;
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.other;
}

function getTimeConfig(time: string) {
  return TIME_CONFIG[time] || TIME_CONFIG.Morning;
}

function getTimeLabel(time: string, t: (key: string) => string): string {
  const config = getTimeConfig(time);
  return t(config.labelKey);
}

function getTransportIcon(transport?: string) {
  if (!transport) return null;
  const t = transport.toLowerCase();
  if (t.includes("walk")) return Footprints;
  if (t.includes("metro") || t.includes("subway") || t.includes("rail") || t.includes("train")) return Train;
  return Bus;
}

// Time period section header
function TimePeriodHeader({ period, emoji }: { period: string; emoji: string }) {
  return (
    <div className="flex items-center gap-2 mb-2 mt-3 first:mt-0">
      <span className="text-sm">{emoji}</span>
      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{period}</span>
      <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
    </div>
  );
}

function DaySection({ day, defaultOpen, dayColor, t }: { day: ItineraryDay; defaultOpen: boolean; dayColor: string; t: (key: string) => string }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Group items by time period
  const groupedItems = useMemo(() => {
    const groups: { period: string; emoji: string; items: ItineraryItem[] }[] = [];
    let currentPeriod = '';
    
    for (const item of day.items) {
      const timeConfig = getTimeConfig(item.time);
      if (item.time !== currentPeriod) {
        currentPeriod = item.time;
        groups.push({ period: getTimeLabel(item.time, t), emoji: timeConfig.emoji, items: [item] });
      } else {
        groups[groups.length - 1].items.push(item);
      }
    }
    return groups;
  }, [day.items, t]);

  return (
    <div className="relative">
      {/* Day Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-white hover:opacity-95 transition-all duration-200 shadow-md group"
        style={{ background: `linear-gradient(135deg, ${dayColor}, ${dayColor}dd)` }}
      >
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 text-sm font-bold">
          {day.day}
        </div>
        <div className="flex-1 text-left">
          <span className="font-semibold text-sm">{t("itinerary.day").replace("{n}", String(day.day))}</span>
          <span className="text-white/70 text-xs ml-2">— {day.title}</span>
        </div>
        <span className="text-xs text-white/50 hidden sm:inline mr-2">
          {day.items.length > 1
            ? t("itinerary.stopsPlural").replace("{count}", String(day.items.length))
            : t("itinerary.stops").replace("{count}", String(day.items.length))}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/50 group-hover:text-white/80"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      {/* Day Items */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="relative pl-8 pt-3 pb-1">
              {/* Vertical timeline line */}
              <div
                className="absolute left-[1.19rem] top-3 bottom-1 w-0.5"
                style={{
                  background: `linear-gradient(to bottom, ${dayColor}, ${dayColor}40)`,
                  opacity: 0.4,
                }}
              />

              {groupedItems.map((group, gi) => (
                <div key={gi}>
                  <TimePeriodHeader period={group.period} emoji={group.emoji} />
                  {group.items.map((item, idx) => (
                    <TimelineItem
                      key={idx}
                      item={item}
                      isLast={gi === groupedItems.length - 1 && idx === group.items.length - 1}
                      index={idx}
                      dayColor={dayColor}
                    />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TimelineItem({
  item,
  isLast,
  index,
  dayColor,
}: {
  item: ItineraryItem;
  isLast: boolean;
  index: number;
  dayColor: string;
}) {
  const catConfig = getCategoryConfig(item.category);
  const TransportIcon = getTransportIcon(item.transport);
  const CategoryIcon = catConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className="relative mb-4 last:mb-1"
    >
      {/* Timeline node */}
      <div
        className="absolute -left-[1.06rem] top-2.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#0d2a1f] shadow-sm z-10"
        style={{ backgroundColor: dayColor }}
      />

      {/* Card */}
      <div className="ml-4 bg-white dark:bg-[#0d2a1f] rounded-xl border border-[#E0C4BC]/30 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="px-3.5 py-3">
          <div className="flex items-start gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: catConfig.color + "15" }}
            >
              <CategoryIcon
                className="h-3.5 w-3.5"
                style={{ color: catConfig.color }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#083022] dark:text-slate-100 text-sm leading-tight">
                {item.name}
              </h4>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="h-3 w-3" />
                  {item.duration}
                </span>
              </div>
              {item.note && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed">
                  {item.note}
                </p>
              )}
            </div>
          </div>
        </div>

        {!isLast && item.transport && (
          <div className="px-3.5 py-2 bg-[#E0C4BC]/10 dark:bg-white/5 border-t border-[#E0C4BC]/20 dark:border-white/10 flex items-center gap-2">
            {TransportIcon && (
              <TransportIcon className="h-3 w-3 text-slate-400 dark:text-slate-500" />
            )}
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              → {item.transport}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ItineraryTimeline({ itinerary, onDaySelect }: ItineraryTimelineProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { t } = useI18n();

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) return null;

  const totalDays = itinerary.days.length;
  const totalItems = itinerary.days.reduce((sum, d) => sum + d.items.length, 0);
  
  // Collect unique cities from day titles
  const cities = [...new Set(itinerary.days.map(d => {
    const match = d.title.match(/(?:in|to|at)\s+(\w+)/i);
    return match ? match[1] : null;
  }).filter(Boolean))];

  const handleDaySelect = (day: number | null) => {
    setSelectedDay(day);
    onDaySelect?.(day);
  };

  const displayDays = selectedDay !== null 
    ? itinerary.days.filter(d => d.day === selectedDay) 
    : itinerary.days;

  const daysLabel = totalDays > 1 
    ? t("itinerary.daysPlural").replace("{count}", String(totalDays)) 
    : t("itinerary.days").replace("{count}", String(totalDays));
  const stopsLabel = totalItems > 1
    ? t("itinerary.stopsPlural").replace("{count}", String(totalItems))
    : t("itinerary.stops").replace("{count}", String(totalItems));

  return (
    <div className="w-full max-w-2xl">
      {/* Overview Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#083022] flex items-center justify-center">
          <MapPin className="h-4 w-4 text-[#6BBFAC]" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-[#083022] dark:text-white text-sm">
            {t("itinerary.title")}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>{daysLabel}</span>
            <span>·</span>
            <span>{stopsLabel}</span>
            {cities.length > 0 && (
              <>
                <span>·</span>
                <span className="flex items-center gap-0.5">
                  <Globe className="h-3 w-3" />
                  {cities.join(' → ')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Day Selector Pills */}
      {totalDays > 1 && (
        <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => handleDaySelect(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              selectedDay === null
                ? 'bg-[#083022] text-white shadow-md'
                : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/15'
            }`}
          >
            {t("itinerary.allDays")}
          </button>
          {itinerary.days.map((day) => {
            const color = getDayColor(day.day);
            const isSelected = selectedDay === day.day;
            return (
              <button
                key={day.day}
                onClick={() => handleDaySelect(isSelected ? null : day.day)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'text-white shadow-md'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/15'
                }`}
                style={isSelected ? { background: color } : undefined}
              >
                {t("itinerary.day").replace("{n}", String(day.day))}
              </button>
            );
          })}
        </div>
      )}

      {/* Day sections */}
      <div className="space-y-3">
        {displayDays.map((day, idx) => (
          <DaySection 
            key={day.day} 
            day={day} 
            defaultOpen={selectedDay !== null || idx < 2} 
            dayColor={getDayColor(day.day)}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}
