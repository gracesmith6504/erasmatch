
import { useState, useEffect, useRef } from "react";
import { Message, Profile, ChatThread } from "@/types";
import { MessageHeader } from "./MessageHeader";
import { DirectMessageList } from "./DirectMessageList";
import { MessageInput } from "./MessageInput";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRealTimeMessages } from "./hooks/useRealTimeMessages";
import MessageEmptyState from "./MessageEmptyState";
import MessageBubble from "./MessageBubble";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use our custom hook for real-time message subscription
  const { localMessages, setLocalMessages } = useRealTimeMessages({
    messages,
    currentUserId,
    partnerId: thread.partner.id,
    scrollToBottom
  });

  // Check if thread has no messages to show suggested prompts
  useEffect(() => {
    setShowSuggestedPrompts(localMessages.length === 0);
  }, [localMessages]);

  // Scroll to bottom when messages change
  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const handleSendMessage = async () => {
    if (!thread || !newMessage.trim()) return;
    
    setIsSending(true);
    try {
      // Create a temporary message to show immediately in the UI
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        sender_id: currentUserId,
        receiver_id: thread.partner.id,
        content: newMessage,
        created_at: new Date().toISOString(),
      };
      
      // Add the temporary message to local state
      setLocalMessages(prev => [...prev, tempMessage]);
      
      // Send the message to the server
      await onSendMessage(thread.partner.id, newMessage);
      setNewMessage("");
      setShowSuggestedPrompts(false); // Hide prompts after sending a message
      
      // Scroll to the bottom after sending
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Mobile back button */}
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

      {/* Enhanced message header with clickable avatar */}
      <MessageHeader 
        isMobile={isMobile} 
        onBack={onBack} 
        profile={thread.partner} 
      />
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 pb-20">
        {localMessages.length === 0 ? (
          <MessageEmptyState />
        ) : (
          <DirectMessageList 
            messages={localMessages} 
            currentUserId={currentUserId}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
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
