"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal, Bot } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MessageInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
  aiProvider: "auto" | "deepseek" | "groq" | "claude";
  onAiProviderChange: (provider: "auto" | "deepseek" | "groq" | "claude") => void;
};

export function MessageInput({ onSend, disabled, aiProvider, onAiProviderChange }: MessageInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="max-w-3xl mx-auto space-y-3">
        {/* AI Provider Selector */}
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">AI 模型：</span>
          <Select value={aiProvider} onValueChange={onAiProviderChange}>
            <SelectTrigger className="w-[160px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">
                <div className="flex flex-col">
                  <span className="font-medium">自动</span>
                  <span className="text-xs text-gray-500">智能切换</span>
                </div>
              </SelectItem>
              <SelectItem value="deepseek">
                <div className="flex flex-col">
                  <span className="font-medium">DeepSeek</span>
                  <span className="text-xs text-gray-500">便宜快速</span>
                </div>
              </SelectItem>
              <SelectItem value="groq">
                <div className="flex flex-col">
                  <span className="font-medium">Groq</span>
                  <span className="text-xs text-gray-500">免费超快</span>
                </div>
              </SelectItem>
              <SelectItem value="claude">
                <div className="flex flex-col">
                  <span className="font-medium">Claude</span>
                  <span className="text-xs text-gray-500">质量最好</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your trip to China..."
            disabled={disabled}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            size="icon"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
