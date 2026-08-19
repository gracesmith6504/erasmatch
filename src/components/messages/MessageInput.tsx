
import { useState, useRef, useCallback, useEffect } from "react";
import { Send } from "lucide-react";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { Profile } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const hasText = newMessage.trim().length > 0;

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
    if (hasText && !isSending) {
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
      if (hasText && !isSending) {
        onSendMessage();
      }
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setNewMessage(prompt);
    onPromptUsed();
  };

  return (
    <div className="p-2.5 sm:p-3 border-t border-border w-full z-50 bg-background">
      {showSuggestedPrompts && (
        <SuggestedPrompts
          onSelectPrompt={handleSelectPrompt}
          onDismiss={onDismissSuggestedPrompts}
          currentUser={currentUser}
          selectedUser={selectedUser}
        />
      )}
      <form onSubmit={handleSubmit} className="flex w-full items-end gap-2">
        {/* Pill-shaped input container */}
        <div className="flex-1 flex items-end bg-muted/50 rounded-3xl border border-border/60 focus-within:border-primary/40 focus-within:bg-background transition-colors px-4 py-1">
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent border-none outline-none resize-none text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground py-2 min-h-[36px] max-h-[120px]"
            placeholder="Message..."
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
        </div>

        {/* Circular send button — animates in when text is entered */}
        <button
          type="submit"
          disabled={!hasText || isSending}
          className={cn(
            "shrink-0 flex items-center justify-center rounded-full w-9 h-9 transition-all duration-200",
            hasText
              ? "bg-primary text-primary-foreground scale-100 opacity-100 active:scale-90"
              : "bg-muted text-muted-foreground scale-75 opacity-40 pointer-events-none"
          )}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
      {remaining <= 100 && (
        <p className={cn(
          "text-xs mt-1.5 text-right tabular-nums",
          remaining <= 20 ? "text-destructive" : "text-amber-500 dark:text-amber-400"
        )}>
          {newMessage.length}/{MAX_LENGTH}
        </p>
      )}
    </div>
  );
};
