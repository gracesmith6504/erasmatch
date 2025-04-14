
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
  showPrompts?: boolean;
}

export const MessageInput = ({
  onSendMessage,
  isSending,
  newMessage,
  setNewMessage,
  showPrompts = false,
}: MessageInputProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage();
  };

  const handleSelectPrompt = (prompt: string) => {
    // If there's already text in the input, confirm before overwriting
    if (newMessage.trim() && newMessage !== prompt) {
      if (window.confirm("Replace your current message with this suggestion?")) {
        setNewMessage(prompt);
      }
    } else {
      setNewMessage(prompt);
    }
  };

  return (
    <div className="p-4 border-t">
      {showPrompts && (
        <SuggestedPrompts onSelectPrompt={handleSelectPrompt} />
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
