
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  onSendMessage: () => Promise<void>;
  isSending: boolean;
  newMessage: string;
  setNewMessage: (message: string) => void;
}

export const MessageInput = ({
  onSendMessage,
  isSending,
  newMessage,
  setNewMessage,
}: MessageInputProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage();
  };

  return (
    <div className="p-4 border-t">
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
