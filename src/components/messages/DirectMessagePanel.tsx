
import { useState, useEffect, useRef } from "react";
import { Message, Profile, ChatThread } from "@/types";
import { MessageHeader } from "./MessageHeader";
import { DirectMessageList } from "./DirectMessageList";
import { MessageInput } from "./MessageInput";
import { useRealTimeMessages } from "./hooks/useRealTimeMessages";
import MessageEmptyState from "./MessageEmptyState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { markMessagesAsRead } from "@/hooks/useUnreadMessageCount";

interface DirectMessagePanelProps {
  thread: ChatThread;
  messages: Message[];
  currentUserId: string;
  currentUserProfile: Profile | null;
  isMobile: boolean;
  onBack?: () => void;
  onSendMessage: (receiverId: string, content: string) => void;
  onPromptUsed?: () => void;
  onUserBlocked?: () => void;
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
  onUserBlocked,
}: DirectMessagePanelProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSuggestedPrompts, setShowSuggestedPrompts] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const lastScrollTop = useRef(0);

  const { localMessages, setLocalMessages } = useRealTimeMessages({
    messages,
    currentUserId,
    partnerId: thread.partner.id,
    scrollToBottom
  });

  useEffect(() => {
    setShowSuggestedPrompts(localMessages.length === 0);
  }, [localMessages]);

  // Mark messages as read when opening the thread
  useEffect(() => {
    if (currentUserId && thread?.partner?.id) {
      markMessagesAsRead(currentUserId, thread.partner.id);
    }
  }, [currentUserId, thread?.partner?.id]);

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
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        sender_id: currentUserId,
        receiver_id: thread.partner.id,
        content: newMessage,
        created_at: new Date().toISOString(),
      };
      
      setLocalMessages(prev => [...prev, tempMessage]);
      
      await onSendMessage(thread.partner.id, newMessage);
      setNewMessage("");
      setShowSuggestedPrompts(false);
      
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const scrollTop = e.currentTarget.scrollTop;
  if (scrollTop < lastScrollTop.current) {
    setIsScrollingUp(true);
  } else {
    setIsScrollingUp(false);
  }
  lastScrollTop.current = scrollTop;
 };


  return (
    <div className="flex flex-col h-full overflow-hidden relative">

  {/* 🔵 HEADER (static, sticky itself) */}
  <MessageHeader
    isMobile={isMobile}
    onBack={onBack}
    profile={thread.partner}
  />

  {/* 🟢 SCROLLABLE MESSAGES AREA */}
  <ScrollArea className="flex-1 overflow-y-auto bg-gray-50" onScroll={handleScroll}>
    <div className="p-4 flex flex-col space-y-4 mx-auto w-full max-w-full md:max-w-4xl lg:max-w-5xl">
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
  </ScrollArea>

  {/* 🟠 STICKY INPUT */}
  <div className={`sticky bottom-0 left-0 right-0 w-full z-20 bg-white border-t transition-transform duration-300 ease-in-out ${isScrollingUp ? 'translate-y-full' : 'translate-y-0'}`}>
    <div className="mx-auto w-full max-w-full md:max-w-4xl lg:max-w-5xl">
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
</div>
  );
};
