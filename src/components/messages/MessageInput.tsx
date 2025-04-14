
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { Profile } from "@/types";

interface MessageInputProps {
  onSendMessage: () => Promise<void>;
  isSending: boolean;
  newMessage: string;
  setNewMessage: (message: string) => void;
  showSuggestedPrompts?: boolean;
  onDismissSuggestedPrompts?: () => void;
  currentUserProfile?: Profile | null;
  partnerProfile?: Profile | null;
}

export const MessageInput = ({
  onSendMessage,
  isSending,
  newMessage,
  setNewMessage,
  showSuggestedPrompts = false,
  onDismissSuggestedPrompts = () => {},
  currentUserProfile,
  partnerProfile,
}: MessageInputProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage();
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
          currentUserProfile={currentUserProfile}
          partnerProfile={partnerProfile}
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
