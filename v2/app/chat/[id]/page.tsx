"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { MessageList, type Message } from "../components/MessageList";
import { MessageInput } from "../components/MessageInput";
import { SessionList } from "../components/SessionList";
import { SaveLocationDialog } from "../components/SaveLocationDialog";
import { WelcomeOnboarding } from "../components/WelcomeOnboarding";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, RefreshCw, Map as MapIcon, MessageCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { Location } from "@/lib/types";
import type { PlaceData } from "@/lib/parsePlaces";
import { parseLocationsFromMessage } from "@/lib/parseLocations";
import { toast } from "sonner";
import Image from "next/image";
import dynamic from "next/dynamic";
import { trackEvent } from "@/lib/analytics";

const MapPanel = dynamic(
  () => import("../components/MapPanel").then((mod) => mod.MapPanel),
  {
    ssr: false,
    loading: () => (
      <div className="h-full bg-gray-100 dark:bg-[#0a1a13] animate-pulse flex items-center justify-center">
        <span className="text-gray-400 text-sm">Loading map...</span>
      </div>
    ),
  }
);

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, user } = useAuth();
  const { t } = useI18n();
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [locationToSave, setLocationToSave] = useState<Location | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [errorRetryCount, setErrorRetryCount] = useState(0);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const autoSendDone = useRef(false);

  // Map state
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [flyToTrigger, setFlyToTrigger] = useState(0);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  // Mobile: toggle between chat and map views
  const [mobileView, setMobileView] = useState<"chat" | "map">("chat");

  // Whether to show the welcome onboarding screen (no messages yet)
  const isNewChat = messages.length === 0;

  // When user clicks "View Details" on a PlaceCard, fly the map there and open its popup
  const handlePlaceViewDetails = useCallback((place: PlaceData) => {
    if (place.latitude && place.longitude) {
      const placeId = `place-${place.name.toLowerCase().replace(/\s+/g, '-')}`;
      // Add as a temporary location so the map picks it up & re-centers
      const placeAsLocation: Location = {
        id: placeId,
        name: place.name,
        description: place.desc || '',
        category: (place.type || 'attraction') as Location['category'],
        latitude: place.latitude,
        longitude: place.longitude,
        city: place.area || '',
      };
      setAllLocations((prev) => {
        const exists = prev.some((l) => l.id === placeAsLocation.id);
        if (exists) return prev;
        return [...prev, placeAsLocation];
      });
      setFlyToTrigger((prev) => prev + 1);
      // Set selectedLocationId to highlight marker and open popup
      setSelectedLocationId(placeId);
      // On mobile, switch to map view
      setMobileView("map");
    }
  }, []);

  // Extract locations from messages whenever messages change
  // Uses BOTH msg.locations (from SSE event) AND client-side parsing of message content
  // to ensure locations always appear on the map even if the SSE event is missed
  useEffect(() => {
    const locs: Location[] = [];
    const seenIds = new Set<string>();

    const addLocation = (loc: Location) => {
      if (loc.id && !seenIds.has(loc.id)) {
        seenIds.add(loc.id);
        locs.push(loc);
      }
    };

    for (const msg of messages) {
      if (msg.role !== "assistant") continue;

      // Source 1: locations attached via SSE event (parsed server-side)
      if (msg.locations) {
        for (const loc of msg.locations) {
          addLocation(loc);
        }
      }

      // Source 2: parse <LOCATION_DATA> from message content (client-side fallback)
      // This is the reliable path — works even if the SSE locations event was missed
      if (msg.content) {
        try {
          const { locations: contentLocs } = parseLocationsFromMessage(msg.content);
          for (const loc of contentLocs) {
            addLocation(loc);
          }
        } catch (e) {
          // Silently skip parse errors during streaming
        }
      }
    }
    console.log('🗺️ ALL LOCATIONS UPDATE:', locs.length, locs.map(l => `${l.name} (${l.latitude},${l.longitude})`));
    setAllLocations((prev) => {
      // Only trigger flyTo if new locations were found that weren't there before
      const prevIds = new Set(prev.map(l => l.id));
      const hasNew = locs.some(l => !prevIds.has(l.id));
      if (hasNew && locs.length > 0) {
        setFlyToTrigger((t) => t + 1);
      }
      return locs;
    });
  }, [messages]);

  // Persist messages to localStorage for guest users
  useEffect(() => {
    if (!session?.access_token && sessionId && messages.length > 0) {
      try {
        localStorage.setItem(`tototrip-chat-${sessionId}`, JSON.stringify(messages));
      } catch (e) {}
    }
  }, [messages, session, sessionId]);

  // Unwrap params Promise and load session
  useEffect(() => {
    params.then(async (p) => {
      const id = p.id;
      setSessionId(id);

      if (!session?.access_token) {
        try {
          const cached = localStorage.getItem(`tototrip-chat-${id}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMessages(parsed);
              setIsLoadingHistory(false);
              return;
            }
          }
        } catch (e) {}
        setMessages([]);
        setIsLoadingHistory(false);
        return;
      }

      await loadChatHistory(id);
    });
  }, [params, session]);

  const loadChatHistory = async (id: string) => {
    try {
      setIsLoadingHistory(true);
      const response = await fetch(`/api/sessions/${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const { messages: dbMessages } = data;
        if (dbMessages && dbMessages.length > 0) {
          setMessages(dbMessages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
            locations: msg.locations,
            timestamp: msg.created_at ? new Date(msg.created_at).getTime() : undefined,
          })));
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      setMessages([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const saveMessage = useCallback(async (role: string, content: string, locations?: any) => {
    if (!session?.access_token || !sessionId) return;
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ session_id: sessionId, role, content, locations }),
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }, [session, sessionId]);

  const handleSaveLocation = useCallback(async (location: Location) => {
    if (!session?.access_token) {
      toast.error('Please login to save locations');
      return;
    }
    setLocationToSave(location);
    setShowSaveDialog(true);
  }, [session]);

  const handleConfirmSaveLocation = useCallback(async (
    location: Location,
    tripId?: string,
    visitDate?: string
  ) => {
    if (!session?.access_token) {
      toast.error('Please login to save locations');
      return;
    }

    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: location.name,
          description: location.description,
          category: location.category,
          address: location.address,
          city: location.city,
          latitude: location.latitude,
          longitude: location.longitude,
          rating: location.rating,
          reviewCount: location.reviewCount,
          priceLevel: location.priceLevel,
          estimatedCost: location.estimatedCost,
          currency: location.currency,
          visitDuration: location.visitDuration,
          bestTimeToVisit: location.bestTimeToVisit,
          openingHours: location.openingHours,
          imageUrl: location.imageUrl,
          images: location.images,
          websiteUrl: location.websiteUrl,
          bookingUrl: location.bookingUrl,
          phone: location.phone,
          tags: location.tags,
          amapId: location.amapId,
          googlePlaceId: location.googlePlaceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Location already saved') {
          toast.info('Location already saved');
          if (tripId && data.location?.id) {
            await addLocationToTrip(data.location.id, tripId, visitDate);
          }
        } else {
          throw new Error(data.error || 'Failed to save location');
        }
        return;
      }

      if (tripId && data.location?.id) {
        await addLocationToTrip(data.location.id, tripId, visitDate);
        toast.success('Location saved and added to trip!');
      } else {
        toast.success('Location saved successfully!');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Failed to save location');
      throw error;
    }
  }, [session]);

  const addLocationToTrip = async (locationId: string, tripId: string, visitDate?: string) => {
    if (!session?.access_token) return;
    try {
      const response = await fetch(`/api/trips/${tripId}/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ locationId, visitDate: visitDate || null }),
      });
      if (!response.ok) throw new Error('Failed to add location to trip');
    } catch (error) {
      console.error('Error adding location to trip:', error);
      toast.error('Failed to add location to trip');
      throw error;
    }
  };

  const generateSessionTitle = useCallback(async (firstMessage: string) => {
    try {
      let title = firstMessage.trim().replace(/[?？]/g, '');
      if (title.length > 40) title = title.substring(0, 40) + '...';
      if (!title) title = 'New Conversation';

      await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ title }),
      });
    } catch (error) {
      console.error('Error generating session title:', error);
    }
  }, [session, sessionId]);

  // Guard against concurrent sends (e.g. double-click, stale closure re-invocation)
  const isSendingRef = useRef(false);

  const handleSendMessage = useCallback(async (content: string) => {
    // Prevent double invocation — fixes duplicate AI replies (P0 #3) and
    // permanent disabled input (P0 #1) caused by concurrent sends.
    if (isSendingRef.current) return;
    isSendingRef.current = true;

    trackEvent('chat_message_sent');
    const now = Date.now();
    const userMessage: Message = { role: "user", content, timestamp: now };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const isFirstMessage = messages.length === 0;
    await saveMessage('user', content);

    try {
      const allMessages = [...messages, userMessage];
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          messages: allMessages,
          tripContext: { destination: "China", sessionId },
        }),
      });

      if (response.status === 429) {
        const errData = await response.json().catch(() => ({}));
        const retryAfter = errData.retryAfter ? Math.ceil(errData.retryAfter / 60) : undefined;
        const rateLimitMsg = t("chat.errorRateLimit") || "You've sent too many messages. Please wait a moment.";
        const retryHint = retryAfter ? ` (${retryAfter} min)` : '';
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `⏳ ${rateLimitMsg}${retryHint}`, timestamp: Date.now() },
        ]);
        setIsLoading(false);
        return;
      }

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader available");

      let assistantMessage = "";
      let assistantLocations: Location[] | undefined = undefined;
      const assistantTimestamp = Date.now();

      setMessages((prev) => [...prev, { role: "assistant", content: "", timestamp: assistantTimestamp }]);

      // SSE line buffer — TCP chunks don't align with SSE event boundaries.
      // A large JSON payload (like locations) can arrive split across multiple
      // reader.read() calls, so we must buffer partial lines.
      let sseBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Append decoded chunk to buffer (stream: true handles multi-byte chars)
        sseBuffer += decoder.decode(value, { stream: true });

        // Process all complete lines (terminated by \n)
        const lines = sseBuffer.split("\n");
        // Last element may be incomplete — keep it in the buffer
        sseBuffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue; // skip empty lines between SSE events
          if (trimmed.startsWith("data: ")) {
            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantMessage += parsed.text;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: "assistant",
                    content: assistantMessage,
                    locations: assistantLocations,
                    timestamp: assistantTimestamp,
                  };
                  return newMessages;
                });
              }
              if (parsed.locations) {
                console.log('🗺️ LOCATIONS RECEIVED via SSE:', parsed.locations.length, parsed.locations);
                assistantLocations = parsed.locations;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: "assistant",
                    content: assistantMessage,
                    locations: assistantLocations,
                    timestamp: assistantTimestamp,
                  };
                  return newMessages;
                });
                setFlyToTrigger((prev) => prev + 1);
              }
            } catch (e) {
              // JSON parse failed — this should not happen with proper buffering,
              // but log it for debugging just in case
              console.warn('🗺️ SSE JSON parse error:', (e as Error).message, 'data:', data.slice(0, 200));
            }
          }
        }
      }

      // Process any remaining data in buffer after stream ends
      if (sseBuffer.trim()) {
        const remaining = sseBuffer.trim();
        if (remaining.startsWith("data: ")) {
          const data = remaining.slice(6);
          if (data !== "[DONE]") {
            try {
              const parsed = JSON.parse(data);
              if (parsed.locations) {
                console.log('🗺️ LOCATIONS RECEIVED via buffer flush:', parsed.locations.length);
                assistantLocations = parsed.locations;
              }
            } catch (e) {
              console.warn('🗺️ Final buffer parse error:', (e as Error).message);
            }
          }
        }
      }

      // Belt-and-suspenders: if SSE locations event was missed for any reason,
      // extract locations client-side from the accumulated message text
      if (!assistantLocations || assistantLocations.length === 0) {
        try {
          const { locations: clientParsed } = parseLocationsFromMessage(assistantMessage);
          if (clientParsed.length > 0) {
            console.log('🗺️ LOCATIONS RECOVERED via client-side parse:', clientParsed.length, clientParsed.map(l => l.name));
            assistantLocations = clientParsed;
          }
        } catch (e) {
          console.warn('🗺️ Client-side location parse failed:', e);
        }
      }

      // Final state update with complete message + locations
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: "assistant",
          content: assistantMessage,
          locations: assistantLocations,
          timestamp: assistantTimestamp,
        };
        return newMessages;
      });
      if (assistantLocations && assistantLocations.length > 0) {
        setFlyToTrigger((prev) => prev + 1);
      }

      await saveMessage('assistant', assistantMessage, assistantLocations);

      if (isFirstMessage && session?.access_token && sessionId) {
        await generateSessionTitle(content);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const newRetryCount = errorRetryCount + 1;
      setErrorRetryCount(newRetryCount);
      setLastFailedMessage(content);

      let errorMsg: string;
      if (!navigator.onLine) {
        errorMsg = "Looks like you're offline! 📡 Please check your internet connection and try again.";
      } else if (newRetryCount >= 3) {
        errorMsg = "I'm having trouble connecting right now. 🐕 This might be a temporary issue — try refreshing the page, or come back in a few minutes.";
      } else {
        errorMsg = "Woof, I hit a bump! 🐕 The AI service is temporarily unavailable. Tap the retry button below to try again.";
      }

      setMessages((prev) => {
        const newMessages = [...prev];
        // If a blank assistant placeholder was already appended, replace it
        // instead of pushing yet another message (prevents ghost double-reply).
        const last = newMessages[newMessages.length - 1];
        if (last && last.role === "assistant" && !last.content) {
          newMessages[newMessages.length - 1] = { role: "assistant", content: errorMsg, timestamp: Date.now() };
        } else {
          newMessages.push({ role: "assistant", content: errorMsg, timestamp: Date.now() });
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
      isSendingRef.current = false;
    }
  }, [messages, sessionId, saveMessage, session, generateSessionTitle, errorRetryCount]);

  const handleRetry = useCallback(() => {
    if (lastFailedMessage) {
      setMessages((prev) => {
        const newMsgs = [...prev];
        if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === "assistant") {
          newMsgs.pop();
        }
        if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === "user") {
          newMsgs.pop();
        }
        return newMsgs;
      });
      handleSendMessage(lastFailedMessage);
    }
  }, [lastFailedMessage, handleSendMessage]);

  // Auto-send from ?q= URL param
  useEffect(() => {
    if (autoSendDone.current || isLoadingHistory || !sessionId) return;
    const q = searchParams.get("q");
    if (q && messages.length === 0) {
      autoSendDone.current = true;
      setTimeout(() => handleSendMessage(q), 300);
    }
  }, [isLoadingHistory, sessionId, messages, searchParams]);

  if (isLoadingHistory) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a1a13]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 relative mx-auto mb-4 animate-float">
              <Image
                src="/brand/totos/plain_toto.png"
                alt="Toto"
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">{t("chat.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen flex bg-gray-50 dark:bg-[#0a1a13]">
      {/* Session List Sidebar */}
      {user && <SessionList currentSessionId={sessionId} />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <div className="bg-white dark:bg-[#0d2a1f] border-b border-gray-200 dark:border-white/10 px-4 py-3 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="text-slate-400 hover:text-[#1a4a3a] dark:hover:text-[#6BBFAC] min-h-[44px] min-w-[44px]"
              aria-label={t("chat.backToHome") || "Back to home"}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 relative rounded-full overflow-hidden bg-[#E0C4BC]/20 dark:bg-[#6BBFAC]/10 ring-2 ring-[#E0C4BC]/30 dark:ring-[#6BBFAC]/20">
                <Image
                  src="/brand/totos/plain_toto.png"
                  alt="toto"
                  fill
                  className="object-contain p-0.5"
                  sizes="32px"
                />
              </div>
              <div>
                <h1 className="font-semibold text-[#083022] dark:text-white text-sm">
                  toto <span className="text-xs">🐕</span>
                </h1>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  AI Travel Companion
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/locations")}
                className="hidden md:flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#1a4a3a] dark:hover:text-[#6BBFAC] text-xs"
              >
                <MapPin className="h-3.5 w-3.5" />
                {t("chat.myPlaces")}
              </Button>
            )}
            {/* Mobile map toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileView(mobileView === "chat" ? "map" : "chat")}
              className="md:hidden flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-[#1a4a3a] dark:hover:text-[#6BBFAC] text-xs min-h-[44px]"
              aria-label={mobileView === "chat" ? "Switch to map view" : "Switch to chat view"}
            >
              {mobileView === "chat" ? (
                <>
                  <MapIcon className="h-3.5 w-3.5" />
                  🗺️ Map
                </>
              ) : (
                <>
                  <MessageCircle className="h-3.5 w-3.5" />
                  💬 Chat
                </>
              )}
            </Button>
            <div className="flex items-center gap-1.5 text-xs text-[#6BBFAC] font-medium bg-[#6BBFAC]/10 px-2.5 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-[#6BBFAC] rounded-full animate-pulse" />
              {t("chat.online")}
            </div>
          </div>
        </div>

        {/* Dual-Column Layout */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Left Column: Chat (55-60%) */}
          <div
            className={`flex flex-col min-w-0 ${
              mobileView === "map" ? "hidden md:flex" : "flex"
            } w-full md:w-[58%] md:border-r md:border-gray-200 dark:md:border-white/10`}
          >
            {/* Welcome Onboarding OR Messages */}
            {isNewChat && !isLoading ? (
              <WelcomeOnboarding onQuickAction={handleSendMessage} />
            ) : (
              <MessageList
                messages={messages}
                isLoading={isLoading}
                onSaveLocation={handleSaveLocation}
                onPlaceViewDetails={handlePlaceViewDetails}
              />
            )}

            {/* Retry button when last message was an error */}
            {lastFailedMessage && !isLoading && (
              <div className="px-4 py-2 bg-[#E95331]/5 border-t border-[#E95331]/20 flex items-center justify-center gap-3">
                <Button
                  onClick={handleRetry}
                  size="sm"
                  className="bg-[#E95331] hover:bg-[#d44a2b] text-white border-0 h-8 px-4 rounded-lg text-xs font-medium"
                >
                  <RefreshCw className="h-3 w-3 mr-1.5" />
                  {t("chat.retry") || "Retry"}
                </Button>
                {errorRetryCount >= 3 && (
                  <Button
                    onClick={() => window.location.reload()}
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 text-xs h-8"
                  >
                    {t("chat.refreshPage") || "Refresh Page"}
                  </Button>
                )}
              </div>
            )}

            {/* Input */}
            <MessageInput
              onSend={handleSendMessage}
              disabled={isLoading}
            />
          </div>

          {/* Right Column: Persistent Map (40-45%) */}
          <div
            className={`${
              mobileView === "chat" ? "hidden md:block" : "block"
            } w-full md:w-[42%] relative`}
          >
            <MapPanel
              locations={allLocations}
              flyToTrigger={flyToTrigger}
              selectedLocationId={selectedLocationId}
              onViewDetails={(loc) => {
                // Could open a detail modal in future
                toast.info(`${loc.name} — details coming soon!`);
              }}
              onSaveLocation={handleSaveLocation}
              className="h-full"
            />

            {/* Mobile: floating chat button on map view */}
            <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
              <Button
                onClick={() => setMobileView("chat")}
                className="bg-[#1a4a3a] hover:bg-[#0d2a1f] text-white shadow-lg rounded-full px-5 py-2.5 text-sm font-medium min-h-[44px]"
                aria-label="Switch to chat view"
              >
                💬 Chat
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile: floating map button on chat view */}
        {mobileView === "chat" && (
          <div className="md:hidden fixed bottom-24 right-4 z-50">
            <Button
              onClick={() => setMobileView("map")}
              className="bg-[#1a4a3a] hover:bg-[#0d2a1f] text-white shadow-lg rounded-full w-14 h-14 p-0 text-lg"
              aria-label="Show map"
            >
              🗺️
            </Button>
          </div>
        )}
      </div>

      {/* Save Location Dialog */}
      <SaveLocationDialog
        location={locationToSave}
        isOpen={showSaveDialog}
        onClose={() => {
          setShowSaveDialog(false);
          setLocationToSave(null);
        }}
        onSave={handleConfirmSaveLocation}
        sessionToken={session?.access_token}
      />
    </main>
  );
}
