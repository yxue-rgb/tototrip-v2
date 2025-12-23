"use client";

import { useState, useCallback, useEffect } from "react";
import { MessageList, type Message } from "../components/MessageList";
import { MessageInput } from "../components/MessageInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [tripId, setTripId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI travel companion for China. 👋\n\nI can help you with:\n- **Planning** your itinerary\n- **Translating** menus and signs\n- **Understanding** Chinese culture and customs\n- **Finding** the best places to eat and visit\n- **Navigating** transportation and payments\n\nWhat would you like to know?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Unwrap params Promise
  useEffect(() => {
    params.then((p) => setTripId(p.id));
  }, [params]);

  const handleSendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the streaming API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          tripContext: {
            destination: "China",
            tripId: tripId,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let assistantMessage = "";

      // Add empty assistant message that we'll update
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantMessage += parsed.text;
                // Update the last message
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: "assistant",
                    content: assistantMessage,
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, tripId]);

  const handleQuickAction = (message: string) => {
    handleSendMessage(message);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold">AI Travel Companion</h1>
            <p className="text-xs text-gray-500">Always here to help</p>
          </div>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-gray-600 mb-2">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Plan a 3-day trip to Beijing",
                "How do I use Alipay?",
                "Recommend local food in Shanghai",
                "Translate common phrases",
              ].map((action, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action)}
                  className="text-xs"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {action}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Input */}
      <MessageInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
