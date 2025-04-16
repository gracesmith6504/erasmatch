
import { useState, useEffect } from "react";
import { Message, Profile, ChatThread } from "@/types";
import { MessageHeader } from "./MessageHeader";
import { DirectMessageList } from "./DirectMessageList";
import { MessageInput } from "./MessageInput";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface DirectMessagePanelProps {
  thread: ChatThread;
  messages: Message[];
  currentUserId: string;
  currentUserProfile: Profile | null;
  isMobile: boolean;
  onBack?: () => void;
  onSendMessage: (receiverId: string, content: string) => void;
  onPromptUsed?: () => void;
}

export const DirectMessagePanel = ({
  thread,
  messages,
  currentUserId,
  currentUserProfile,
  isMobile,
  onBack,
  onSendMessage,
  onPromptUsed = () => {},
}: DirectMessagePanelProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSuggestedPrompts, setShowSuggestedPrompts] = useState(false);

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a");
  };

  // Check if thread has no messages to show suggested prompts
  useEffect(() => {
    setShowSuggestedPrompts(messages.length === 0);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!thread || !newMessage.trim()) return;
    
    setIsSending(true);
    try {
      await onSendMessage(thread.partner.id, newMessage);
      setNewMessage("");
      setShowSuggestedPrompts(false); // Hide prompts after sending a message
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Custom back button for mobile */}
      {isMobile && onBack && (
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="p-2 flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="flex items-center text-gray-600"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Back to students</span>
            </Button>
          </div>
        </div>
      )}

      {/* Standard header (used on desktop) */}
      {(!isMobile || !onBack) && (
        <MessageHeader 
          isMobile={isMobile} 
          onBack={onBack} 
          profile={thread.partner} 
        />
      )}
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 pb-20">
        <DirectMessageList 
          messages={messages} 
          currentUserId={currentUserId}
          formatMessageDate={formatMessageDate}
        />
      </div>
      
      <div className="sticky bottom-0 w-full bg-white border-t">
        <MessageInput 
          onSendMessage={handleSendMessage}
          isSending={isSending}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          showSuggestedPrompts={showSuggestedPrompts}
          onDismissSuggestedPrompts={() => setShowSuggestedPrompts(false)}
          onPromptUsed={onPromptUsed}
          currentUser={currentUserProfile}
          selectedUser={thread.partner}
        />
      </div>
    </div>
  );
};
