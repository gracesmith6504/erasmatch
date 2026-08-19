
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Message, Profile, ChatThread } from "@/types";
import { MessageHeader } from "./MessageHeader";
import { DirectMessageList } from "./DirectMessageList";
import { MessageInput } from "./MessageInput";
import { useRealTimeMessages } from "./hooks/useRealTimeMessages";
import MessageEmptyState from "./MessageEmptyState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { markMessagesAsRead } from "@/hooks/useUnreadMessageCount";
import { useConversationReactions } from "@/hooks/useReactions";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [showScrollFab, setShowScrollFab] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((instant?: boolean) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: instant ? "instant" : "smooth",
    });
  }, []);

  const { localMessages, setLocalMessages } = useRealTimeMessages({
    messages,
    currentUserId,
    partnerId: thread.partner.id,
    scrollToBottom: () => scrollToBottom(),
  });

  const messageIds = useMemo(() => localMessages.map((m) => m.id), [localMessages]);
  const { summariesByMessage, toggleReaction } = useConversationReactions(
    messageIds,
    "direct",
    currentUserId
  );

  useEffect(() => {
    setShowSuggestedPrompts(localMessages.length === 0);
  }, [localMessages]);

  // Mark messages as read when opening the thread
  useEffect(() => {
    if (currentUserId && thread?.partner?.id) {
      markMessagesAsRead(currentUserId, thread.partner.id);
    }
  }, [currentUserId, thread?.partner?.id]);

  useEffect(() => {
    scrollToBottom(true);
  }, [localMessages, scrollToBottom]);

  // Track scroll position for FAB visibility
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollFab(distanceFromBottom > 200);
  }, []);

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

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <MessageHeader
        isMobile={isMobile}
        onBack={onBack}
        profile={thread.partner}
        onUserBlocked={onUserBlocked}
      />

      {/* Scrollable messages area */}
      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto bg-muted/20"
        onScroll={handleScroll}
      >
        <div className="p-4 flex flex-col mx-auto w-full max-w-full md:max-w-4xl lg:max-w-5xl">
          {localMessages.length === 0 ? (
            <MessageEmptyState
              partner={thread.partner}
              currentUser={currentUserProfile}
            />
          ) : (
            <DirectMessageList
              messages={localMessages}
              currentUserId={currentUserId}
              reactionsByMessage={summariesByMessage}
              onToggleReaction={toggleReaction}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Scroll-to-bottom FAB */}
      <button
        onClick={() => scrollToBottom()}
        className={cn(
          "absolute right-4 z-10 flex items-center justify-center",
          "w-9 h-9 rounded-full bg-background border border-border shadow-md",
          "transition-all duration-200",
          showScrollFab
            ? "opacity-100 scale-100 bottom-[85px]"
            : "opacity-0 scale-75 bottom-[85px] pointer-events-none"
        )}
        aria-label="Scroll to bottom"
      >
        <ArrowDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Input area */}
      <div className="sticky bottom-0 left-0 right-0 w-full z-20 bg-background">
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
