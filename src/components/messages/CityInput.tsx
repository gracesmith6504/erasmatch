
import { useState, useRef, useCallback, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GroupMessageSuggestions } from "./GroupMessageSuggestions";

const MAX_LENGTH = 500;

interface CityInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isSending: boolean;
  cityName: string;
  showSuggestions?: boolean;
  onSuggestionUsed?: () => void;
}

export const CityInput = ({ 
  onSendMessage, 
  isSending, 
  cityName,
  showSuggestions = false,
  onSuggestionUsed = () => {}
}: CityInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [showPrompts, setShowPrompts] = useState(showSuggestions);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
      if (showPrompts) {
        setShowPrompts(false);
        onSuggestionUsed();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim()) {
        onSendMessage(newMessage);
        setNewMessage("");
        if (showPrompts) {
          setShowPrompts(false);
          onSuggestionUsed();
        }
      }
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setNewMessage(prompt);
    setShowPrompts(false);
    onSuggestionUsed();
  };

  const handleDismissPrompts = () => {
    setShowPrompts(false);
    onSuggestionUsed();
  };

  return (
    <div className="w-full space-y-4">
      {showPrompts && (
        <GroupMessageSuggestions
          chatType="city"
          cityName={cityName}
          onSelectPrompt={handleSelectPrompt}
          onDismiss={handleDismissPrompts}
        />
      )}
      <form onSubmit={handleSubmit} className="flex w-full space-x-2 items-end">
        <Textarea
          ref={textareaRef}
          className="flex-1 min-h-[40px] max-h-[120px] resize-none py-2"
          placeholder="Type a message to your city group..."
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
        <Button type="submit" disabled={!newMessage.trim() || isSending}>
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
