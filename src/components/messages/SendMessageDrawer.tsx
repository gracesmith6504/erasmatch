
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

  useEffect(() => {
    if (isOpen && currentUserId && recipientId) {
      const currentProfile = profiles.find(p => p.id === currentUserId);
      const recipientProfile = profiles.find(p => p.id === recipientId);
      
      if (currentProfile && recipientProfile) {
        generateSuggestedMessages(currentProfile, recipientProfile);
      }
    }
  }, [isOpen, currentUserId, recipientId, profiles]);

  const generateSuggestedMessages = (currentUser: Profile, recipient: Profile) => {
    const suggestions: string[] = [];
    
    // Check for matching university
    if (currentUser?.university && recipient.university && 
        currentUser.university === recipient.university) {
      suggestions.push(`hi! saw ur also going to ${recipient.university}, figured i'd say hey 👋`);
    }
    
    // Check for matching city
    if (currentUser?.city && recipient.city && 
        currentUser.city === recipient.city) {
      suggestions.push(`Hey! I saw you're also going to ${recipient.city} — do you have housing yet?`);
    }
    
    // Check for matching home university
    if (currentUser?.home_university && recipient.home_university && 
        currentUser.home_university === recipient.home_university) {
      suggestions.push(`Saw you're also from ${recipient.home_university}, had to say hey 👋`);
    }
    
    // Always add a general fallback
    suggestions.push("hey 👋 just saying hi before things get busy");
    
    // Randomize and limit to 3 suggestions
    const shuffledSuggestions = [...suggestions].sort(() => 0.5 - Math.random());
    setSuggestedMessages(shuffledSuggestions.slice(0, 3));
  };

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
