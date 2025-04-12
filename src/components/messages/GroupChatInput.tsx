
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GroupChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isSending: boolean;
}

export const GroupChatInput = ({ onSendMessage, isSending }: GroupChatInputProps) => {
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
        placeholder="Type a message to the group..."
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
