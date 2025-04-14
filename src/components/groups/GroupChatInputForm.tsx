
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

type GroupChatInputFormProps = {
  onSendMessage: (message: string) => Promise<void>;
  isSending: boolean;
  placeholder: string;
};

const GroupChatInputForm = ({ 
  onSendMessage, 
  isSending, 
  placeholder 
}: GroupChatInputFormProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage).then(() => {
        setNewMessage("");
      });
    }
  };

  return (
    <div className="p-4 border-t">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={placeholder}
          disabled={isSending}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={!newMessage.trim() || isSending}
          className={isSending ? "opacity-50" : ""}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default GroupChatInputForm;
