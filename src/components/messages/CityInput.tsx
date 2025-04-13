
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CityInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isSending: boolean;
}

export const CityInput = ({ onSendMessage, isSending }: CityInputProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        placeholder="Type a message to your city group..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        disabled={isSending}
      />
      <Button type="submit" disabled={!newMessage.trim() || isSending}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
