
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { Profile } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

const MAX_LENGTH = 500;

interface MessageInputProps {
  onSendMessage: () => Promise<void>;
  isSending: boolean;
  newMessage: string;
  setNewMessage: (message: string) => void;
  showSuggestedPrompts?: boolean;
  onDismissSuggestedPrompts?: () => void;
  onPromptUsed?: () => void;
  currentUser?: Profile | null;
  selectedUser?: Profile | null;
}

export const MessageInput = ({
  onSendMessage,
  isSending,
  newMessage,
  setNewMessage,
  showSuggestedPrompts = false,
  onDismissSuggestedPrompts = () => {},
  onPromptUsed = () => {},
  currentUser,
  selectedUser,
}: MessageInputProps) => {
  const isMobile = useIsMobile();
  const remaining = MAX_LENGTH - newMessage.length;
  
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
    onPromptUsed();
  };

  return (
    <div className="p-3 sm:p-4 border-t w-full z-50 bg-white">
      {showSuggestedPrompts && (
        <SuggestedPrompts
          onSelectPrompt={handleSelectPrompt}
          onDismiss={onDismissSuggestedPrompts}
          currentUser={currentUser}
          selectedUser={selectedUser}
        />
      )}
      <form onSubmit={handleSubmit} className="flex w-full space-x-2">
        <Input
          className="flex-1"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value.slice(0, MAX_LENGTH))}
          maxLength={MAX_LENGTH}
          disabled={isSending}
        />
        <Button type="submit" disabled={!newMessage.trim() || isSending} className="flex-shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </form>
      {remaining <= 100 && (
        <p className={`text-xs mt-1 text-right ${remaining <= 20 ? 'text-red-500' : 'text-amber-500'}`}>
          {newMessage.length}/{MAX_LENGTH}
        </p>
      )}
    </div>
  );
};
