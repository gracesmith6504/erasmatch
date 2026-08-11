
import { useState, useRef, useCallback, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = parseInt(getComputedStyle(el).lineHeight) || 20;
    const maxHeight = lineHeight * 4;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, []);

  // Resize textarea when value changes programmatically (prompt selection, clear after send)
  useEffect(() => {
    autoResize();
  }, [newMessage, autoResize]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim() && !isSending) {
        onSendMessage();
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
      <form onSubmit={handleSubmit} className="flex w-full space-x-2 items-end">
        <Textarea
          ref={textareaRef}
          className="flex-1 min-h-[40px] max-h-[120px] resize-none py-2"
          placeholder="Type a message..."
          value={newMessage}
          rows={1}
          onChange={(e) => {
            setNewMessage(e.target.value.slice(0, MAX_LENGTH));
            autoResize();
          }}
          onKeyDown={handleKeyDown}
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
