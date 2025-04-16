
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GroupMessageSuggestions } from "./GroupMessageSuggestions";

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
      <form onSubmit={handleSubmit} className="flex w-full space-x-2">
        <Input
          className="flex-1"
          placeholder="Type a message to your city group..."
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
