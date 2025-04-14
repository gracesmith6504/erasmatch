
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuggestedPrompts } from "./SuggestedPrompts";

interface MessageInputProps {
  onSendMessage: () => Promise<void>;
  isSending: boolean;
  newMessage: string;
  setNewMessage: (message: string) => void;
  showSuggestedPrompts?: boolean;
  onDismissSuggestedPrompts?: () => void;
}

export const MessageInput = ({
  onSendMessage,
  isSending,
  newMessage,
  setNewMessage,
  showSuggestedPrompts = false,
  onDismissSuggestedPrompts = () => {},
}: MessageInputProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isSending) {
      try {
        await onSendMessage();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setNewMessage(prompt);
  };

  return (
    <div className="p-4 border-t">
      {showSuggestedPrompts && (
        <SuggestedPrompts
          onSelectPrompt={handleSelectPrompt}
          onDismiss={onDismissSuggestedPrompts}
        />
      )}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isSending}
        />
        <Button type="submit" disabled={!newMessage.trim() || isSending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
