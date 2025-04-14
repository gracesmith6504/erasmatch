import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { SuggestedMessagesList } from "./SuggestedMessagesList";
import { Profile } from "@/types";

type SendMessageDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  recipientName: string;
  onMessageSent?: () => void;
};

export const SendMessageDrawer = ({
  isOpen,
  onOpenChange,
  recipientId,
  recipientName,
  onMessageSent
}: SendMessageDrawerProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const { handleSendMessage, profiles } = useData();
  const { currentUserId } = useAuth();

  // Always show these static suggestions when drawer opens
  useEffect(() => {
    if (isOpen) {
      setSuggestedMessages([
        "hey 👋",
        "We should meet up!",
        "you found accomodation yet?"
      ]);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!message.trim() || !currentUserId) return;
    
    setIsSending(true);
    try {
      await handleSendMessage(recipientId, message.trim());
      setMessage("");
      if (onMessageSent) {
        onMessageSent();
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectSuggestion = (text: string) => {
    setMessage(text);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] p-6">
        <DrawerHeader className="px-0">
          <div className="flex items-center justify-between">
            <DrawerTitle>Message {recipientName}</DrawerTitle>
            <DrawerClose asChild>
              <Button size="icon" variant="ghost">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="space-y-4 pt-4">
          {currentUserId && (
            <SuggestedMessagesList
              suggestions={suggestedMessages}
              onSelectMessage={handleSelectSuggestion}
              currentMessage={message}
              receiverId={recipientId}
              currentUserId={currentUserId}
            />
          )}

          <Textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-32 message-input"
          />

          <div className="flex justify-end">
            <Button 
              onClick={handleSend} 
              disabled={!message.trim() || isSending}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
