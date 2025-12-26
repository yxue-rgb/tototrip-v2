"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef } from "react";
import { Location } from "@/lib/types";
import { LocationsGrid } from "./LocationCard";
import { LocationMap } from "./LocationMap";
import { parseLocationsFromMessage } from "@/lib/parseLocations";

export type Message = {
  role: "user" | "assistant";
  content: string;
  locations?: Location[];
};

type MessageListProps = {
  messages: Message[];
  isLoading?: boolean;
  onSaveLocation?: (location: Location) => Promise<void>;
};

export function MessageList({ messages, isLoading, onSaveLocation }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} onSaveLocation={onSaveLocation} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
    </ScrollArea>
  );
}

function MessageBubble({ message, onSaveLocation }: { message: Message; onSaveLocation?: (location: Location) => Promise<void> }) {
  const isUser = message.role === "user";

  // Parse locations from AI messages with error handling
  let parsed = { text: message.content, locations: [] as Location[] };

  if (!isUser && message.content) {
    try {
      parsed = parseLocationsFromMessage(message.content);
    } catch (error) {
      console.error('Error parsing locations:', error);
      // Gracefully degrade - just show the message without locations
      parsed = { text: message.content, locations: [] };
    }
  }

  const displayText = isUser ? message.content : parsed.text;
  const locations = parsed.locations;

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} gap-3 w-full`}>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-none"
              : "bg-gray-100 text-gray-900 rounded-tl-none"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{displayText}</p>
          ) : (
            <Markdown
              className="prose prose-sm max-w-none prose-p:m-0 prose-p:leading-relaxed"
              remarkPlugins={[remarkGfm]}
            >
              {displayText}
            </Markdown>
          )}
        </div>
      </motion.div>

      {/* Display location cards and map if present */}
      {!isUser && locations.length > 0 && (
        <div className="w-full max-w-4xl space-y-4">
          <LocationsGrid
            locations={locations}
            onSave={onSaveLocation}
            showSaveButton={!!onSaveLocation}
          />
          <LocationMap locations={locations} height="300px" />
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
        <div className="flex gap-1">
          <div className="typing__dot"></div>
          <div className="typing__dot"></div>
          <div className="typing__dot"></div>
        </div>
      </div>
    </div>
  );
}
