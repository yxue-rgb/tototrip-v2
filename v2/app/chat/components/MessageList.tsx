"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";

// Lazy-load react-markdown + remark-gfm to reduce initial bundle (~60KB gzipped)
const LazyMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { Location } from "@/lib/types";
import { LocationsGrid } from "./LocationCard";
import { parseLocationsFromMessage } from "@/lib/parseLocations";
import { parseItineraryFromMessage, Itinerary } from "@/lib/parseItinerary";
import { parsePlacesFromMessage, type PlaceData } from "@/lib/parsePlaces";
import { User, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

// Code-split heavy components
const ItineraryTimeline = dynamic(
  () => import("./ItineraryTimeline").then((mod) => mod.ItineraryTimeline),
  { ssr: false, loading: () => <div className="h-32 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" /> }
);
const SaveTripButton = dynamic(
  () => import("./SaveTripButton").then((mod) => mod.SaveTripButton),
  { ssr: false }
);
const PlaceCardsGrid = dynamic(
  () => import("./PlaceCard").then((mod) => mod.PlaceCardsGrid),
  { ssr: false, loading: () => <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" /> }
);

/** Threshold in characters for collapsible long messages */
const COLLAPSE_THRESHOLD = 800;

export type Message = {
  role: "user" | "assistant";
  content: string;
  locations?: Location[];
  timestamp?: number;
};

type MessageListProps = {
  messages: Message[];
  isLoading?: boolean;
  onSaveLocation?: (location: Location) => Promise<void>;
  onPlaceViewDetails?: (place: PlaceData) => void;
};

export function MessageList({ messages, isLoading, onSaveLocation, onPlaceViewDetails }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-[#0a1a13]" viewportRef={scrollRef}>
      <div className="max-w-3xl mx-auto space-y-5 py-4 pb-8">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} onSaveLocation={onSaveLocation} onPlaceViewDetails={onPlaceViewDetails} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
    </ScrollArea>
  );
}

function formatRelativeTime(ts?: number): string {
  if (!ts) return "";
  const now = Date.now();
  const diff = now - ts;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;

  const date = new Date(ts);
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ message, onSaveLocation, onPlaceViewDetails }: { message: Message; onSaveLocation?: (location: Location) => Promise<void>; onPlaceViewDetails?: (place: PlaceData) => void }) {
  const isUser = message.role === "user";
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  }, [message.content]);

  let displayText = message.content;
  let locations: Location[] = [];
  let itinerary: Itinerary | null = null;
  let places: PlaceData[] = [];

  if (!isUser && message.content) {
    try {
      const locParsed = parseLocationsFromMessage(message.content);
      const itinParsed = parseItineraryFromMessage(locParsed.text);
      const placeParsed = parsePlacesFromMessage(itinParsed.text);
      displayText = placeParsed.text;
      locations = locParsed.locations;
      itinerary = itinParsed.itinerary;
      places = placeParsed.places;
    } catch (error) {
      console.error('Error parsing message:', error);
      displayText = message.content;
    }
  }

  // Long message collapse logic
  const isLongMessage = !isUser && displayText.length > COLLAPSE_THRESHOLD;
  const visibleText = isLongMessage && !isExpanded
    ? displayText.slice(0, COLLAPSE_THRESHOLD) + "…"
    : displayText;

  const timeStr = formatRelativeTime(message.timestamp);

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} gap-3 w-full`}>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`group/msg flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"} max-w-[85%]`}
      >
        {/* Avatar */}
        {isUser ? (
          <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-[#083022] dark:bg-[#6BBFAC]/20 shadow-sm">
            <User className="h-3.5 w-3.5 text-white dark:text-[#6BBFAC]" />
          </div>
        ) : (
          <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden relative bg-[#E0C4BC]/20 dark:bg-[#6BBFAC]/10 ring-2 ring-[#E0C4BC]/30 dark:ring-[#6BBFAC]/20 shadow-sm">
            <Image
              src="/brand/totos/plain_toto.png"
              alt="Toto"
              fill
              className="object-contain p-0.5"
              sizes="32px"
            />
          </div>
        )}

        {/* Bubble + actions */}
        <div className="relative">
          {/* Copy button for AI messages */}
          {!isUser && message.content && (
            <button
              onClick={handleCopy}
              className="absolute -top-2 -right-2 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg bg-white dark:bg-[#0d2a1f] border border-gray-200 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title={t("chat.copyMessage")}
              aria-label={t("chat.copyMessage") || "Copy message"}
            >
              {copied ? (
                <Check className="h-3 w-3 text-[#6BBFAC]" />
              ) : (
                <Copy className="h-3 w-3 text-gray-400 dark:text-slate-500" />
              )}
            </button>
          )}

          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? "bg-[#083022] dark:bg-[#083022] text-white rounded-br-md shadow-md"
                : "bg-white dark:bg-[#0d2a1f] text-gray-800 dark:text-slate-200 rounded-bl-md shadow-sm border border-gray-200 dark:border-white/10"
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{displayText}</p>
            ) : (
              <>
                <LazyMarkdown
                  className="prose prose-sm max-w-none prose-p:my-1 prose-p:leading-relaxed prose-headings:text-gray-900 dark:prose-headings:text-slate-100 prose-headings:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-slate-100 prose-li:my-0.5 prose-ul:my-1 prose-ol:my-1 text-gray-700 dark:text-slate-300 break-words overflow-x-auto [&_pre]:overflow-x-auto [&_table]:overflow-x-auto [&_table]:block [&_table]:w-full [&_code]:break-words [&_a]:break-words"
                  remarkPlugins={[remarkGfm]}
                >
                  {visibleText}
                </LazyMarkdown>
                {/* Show more / Show less toggle */}
                {isLongMessage && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1 mt-2 text-xs font-medium text-[#6BBFAC] hover:text-[#5aab99] dark:text-[#6BBFAC] dark:hover:text-[#8dd4c4] transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3.5 w-3.5" />
                        {t("chat.showLess")}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3.5 w-3.5" />
                        {t("chat.showMore")}
                      </>
                    )}
                  </button>
                )}
              </>
            )}

            {/* Timestamp — relative format */}
            {timeStr && (
              <p className={`text-[10px] mt-1.5 text-right ${
                isUser
                  ? "text-white/40"
                  : "text-gray-300 dark:text-slate-600"
              }`}>
                {timeStr}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Place cards (AI Rich Cards) */}
      {!isUser && places.length > 0 && (
        <div className="w-full max-w-4xl ml-10">
          <PlaceCardsGrid places={places} onViewDetails={onPlaceViewDetails} />
        </div>
      )}

      {/* Location cards (map is in the right panel, not inline) */}
      {!isUser && locations.length > 0 && (
        <div className="w-full max-w-4xl ml-10">
          <LocationsGrid
            locations={locations}
            onSave={onSaveLocation}
            showSaveButton={!!onSaveLocation}
          />
        </div>
      )}

      {/* Itinerary Timeline + Save/Share buttons */}
      {!isUser && itinerary && (
        <div className="w-full max-w-4xl ml-10">
          <ItineraryTimeline itinerary={itinerary} />
          <SaveTripButton itinerary={itinerary} locations={locations} />
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2.5"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden relative bg-[#E0C4BC]/20 dark:bg-[#6BBFAC]/10 ring-2 ring-[#E0C4BC]/30 dark:ring-[#6BBFAC]/20 shadow-sm">
        <Image
          src="/brand/totos/plain_toto.png"
          alt="Toto"
          fill
          className="object-contain p-0.5 animate-float"
          sizes="32px"
        />
      </div>
      <div className="bg-white dark:bg-[#0d2a1f] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1">
            <div className="typing__dot-bounce"></div>
            <div className="typing__dot-bounce"></div>
            <div className="typing__dot-bounce"></div>
          </div>
          <span className="text-xs text-[#1a4a3a] dark:text-[#6BBFAC] font-medium">
            {t("chat.thinking") || "Toto is thinking..."}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
