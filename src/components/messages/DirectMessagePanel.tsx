
import { useState, useEffect } from "react";
import { Message, Profile, ChatThread } from "@/types";
import { MessageHeader } from "./MessageHeader";
import { DirectMessageList } from "./DirectMessageList";
import { MessageInput } from "./MessageInput";
import { format } from "date-fns";

interface DirectMessagePanelProps {
  thread: ChatThread;
  messages: Message[];
  currentUserId: string;
  isMobile: boolean;
  onBack?: () => void;
  onSendMessage: (receiverId: string, content: string) => void;
  onPromptUsed?: () => void; // New prop to handle prompt selection
}

export const DirectMessagePanel = ({
  thread,
  messages,
  currentUserId,
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
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        isSending={isSending}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        showSuggestedPrompts={showSuggestedPrompts}
        onDismissSuggestedPrompts={() => setShowSuggestedPrompts(false)}
        onPromptUsed={onPromptUsed}
      />
    </div>
  );
};
