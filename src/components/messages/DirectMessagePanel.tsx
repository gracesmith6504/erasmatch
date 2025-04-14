
import { useState, useEffect } from "react";
import { Message, Profile, ChatThread } from "@/types";
import { MessageHeader } from "./MessageHeader";
import { DirectMessageList } from "./DirectMessageList";
import { MessageInput } from "./MessageInput";
import { format } from "date-fns";
import { SuggestedMessagesList } from "./SuggestedMessagesList";
import { useData } from "@/contexts/DataContext";

interface DirectMessagePanelProps {
  thread: ChatThread;
  messages: Message[];
  currentUserId: string;
  isMobile: boolean;
  onBack?: () => void;
  onSendMessage: (receiverId: string, content: string) => void;
}

export const DirectMessagePanel = ({
  thread,
  messages,
  currentUserId,
  isMobile,
  onBack,
  onSendMessage,
}: DirectMessagePanelProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { profiles } = useData();
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);

  // Get current user profile
  const currentUserProfile = profiles.find(p => p.id === currentUserId);
  
  // Generate suggested messages when thread changes
  useEffect(() => {
    if (messages.length === 0 && thread?.partner) {
      generateSuggestedMessages(currentUserProfile, thread.partner);
    }
  }, [thread, messages.length, currentUserProfile]);

  const generateSuggestedMessages = (currentUser: Profile | undefined, partner: Profile) => {
    const suggestions: string[] = [];
    
    // Check for matching university
    if (currentUser?.university && partner.university && 
        currentUser.university === partner.university) {
      suggestions.push(`hi! saw ur also going to ${partner.university}, figured i'd say hey 👋`);
    }
    
    // Check for matching city
    if (currentUser?.city && partner.city && 
        currentUser.city === partner.city) {
      suggestions.push(`Hey! I saw you're also going to ${partner.city} — do you have housing yet?`);
    }
    
    // Check for matching home university
    if (currentUser?.home_university && partner.home_university && 
        currentUser.home_university === partner.home_university) {
      suggestions.push(`Saw you're also from ${partner.home_university}, had to say hey 👋`);
    }
    
    // Always add a general fallback
    suggestions.push("hey 👋 just saying hi before things get busy");
    
    // Randomize and limit to 3 suggestions
    const shuffledSuggestions = [...suggestions].sort(() => 0.5 - Math.random());
    setSuggestedMessages(shuffledSuggestions.slice(0, 3));
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a");
  };

  const handleSendMessage = async () => {
    if (!thread || !newMessage.trim()) return;
    
    setIsSending(true);
    try {
      await onSendMessage(thread.partner.id, newMessage);
      setNewMessage("");
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectSuggestion = (text: string) => {
    setNewMessage(text);
  };

  const showSuggestions = messages.length === 0 && suggestedMessages.length > 0;

  return (
    <div className="flex flex-col w-full md:w-2/3 h-full">
      <MessageHeader 
        isMobile={isMobile} 
        onBack={onBack} 
        profile={thread.partner} 
      />
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
        <DirectMessageList 
          messages={messages} 
          currentUserId={currentUserId}
          formatMessageDate={formatMessageDate}
        />
      </div>
      
      {showSuggestions && (
        <div className="px-4">
          <SuggestedMessagesList
            suggestions={suggestedMessages}
            onSelectMessage={handleSelectSuggestion}
            currentMessage={newMessage}
            receiverId={thread.partner.id}
            currentUserId={currentUserId}
          />
        </div>
      )}
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        isSending={isSending}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
      />
    </div>
  );
};
