
import { useState, useEffect, useRef } from "react";
import { Message, Profile, ChatThread } from "@/types";
import { MessageHeader } from "./MessageHeader";
import { DirectMessageList } from "./DirectMessageList";
import { MessageInput } from "./MessageInput";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a");
  };

  // Initialize local messages from props
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Set up Supabase real-time subscription
  useEffect(() => {
    if (!currentUserId || !thread.partner.id) return;

    // Subscribe to new messages between current user and thread partner
    const channel = supabase
      .channel('direct-messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `sender_id=eq.${thread.partner.id}`,
        }, 
        (payload) => {
          // Only add the message if it's for the current user
          const newMessage = payload.new as Message;
          if (newMessage.receiver_id === currentUserId) {
            setLocalMessages(prevMessages => [...prevMessages, newMessage]);
            scrollToBottom();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, thread.partner.id]);

  // Check if thread has no messages to show suggested prompts
  useEffect(() => {
    setShowSuggestedPrompts(localMessages.length === 0);
  }, [localMessages]);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
          messages={localMessages} 
          currentUserId={currentUserId}
          formatMessageDate={formatMessageDate}
        />
        <div ref={messagesEndRef} />
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
