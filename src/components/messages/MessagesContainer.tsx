import { useIsMobile } from "@/hooks/use-mobile";
import { Message, Profile } from "@/types";
import { MobileMessagesView } from "./MobileMessagesView";
import { DesktopMessagesView } from "./DesktopMessagesView";
import { useMessageState } from "@/hooks/useMessageState";
import { useInitialUserSelection } from "@/hooks/useInitialUserSelection";
import { createMessageHandler } from "./utils/messageUtils";
import { useState, useEffect, useMemo, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBlockedUsers } from "@/hooks/useBlockedUsers";
import { cn } from "@/lib/utils";

interface MessagesContainerProps {
  messages: Message[];
  profiles: Profile[];
  currentUserId: string;
  onSendMessage: (receiverId: string, content: string) => Promise<void>;
  initialSelectedUser?: string | null;
}

export const MessagesContainer = ({
  messages,
  profiles,
  currentUserId,
  onSendMessage,
  initialSelectedUser = null,
}: MessagesContainerProps) => {
  const isMobile = useIsMobile();
  const [showMobileThreadList, setShowMobileThreadList] = useState(true);
  const { blockedIds, refetch: refetchBlocked } = useBlockedUsers();
  
  const {
    selectedThread,
    setSelectedThread,
    messagesSent,
    setMessagesSent,
    refreshKey,
    setRefreshKey,
    currentUserProfile,
    threads,
    threadMessages
  } = useMessageState(messages, profiles, currentUserId, initialSelectedUser);

  // Filter out threads with blocked users
  const filteredThreads = useMemo(
    () => threads.filter(t => !blockedIds.includes(t.partner.id)),
    [threads, blockedIds]
  );

  const handleUserBlocked = () => {
    refetchBlocked();
    setSelectedThread(null);
    if (isMobile) setShowMobileThreadList(true);
  };

  // When a thread is auto-selected (e.g. from ?user= URL param), slide to the conversation.
  // Only trigger when selectedThread first appears while the thread list is still visible,
  // to avoid re-triggering mid-transition or on every selectedThread change.
  const prevSelectedRef = useRef<string | null>(null);
  useEffect(() => {
    const currentId = selectedThread?.partner?.id ?? null;
    if (isMobile && currentId && currentId !== prevSelectedRef.current && showMobileThreadList) {
      setShowMobileThreadList(false);
    }
    prevSelectedRef.current = currentId;
  }, [selectedThread, isMobile, showMobileThreadList]);

  useInitialUserSelection({
    initialSelectedUserId: initialSelectedUser,
    profiles,
    threads,
    selectedThread,
    isMobile,
    viewMode: "direct",
    setSelectedThread,
    setShowGroupsList: () => {},
    setShowCityList: () => {},
    setSelectedView: () => {},
    refreshKey
  });

  const handleSendMessage = createMessageHandler(
    onSendMessage, 
    setMessagesSent, 
    setRefreshKey, 
    () => {}
  );

  const handlePromptUsed = () => {};

  const handleBackToThreadList = () => {
    setShowMobileThreadList(true);
  };

  if (isMobile) {
    return (
      <div className="h-full w-full overflow-hidden relative">
        {/* Thread list panel */}
        <div
          className="absolute inset-0"
          style={{
            transform: showMobileThreadList ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1)",
            backfaceVisibility: "hidden",
          }}
        >
          <ScrollArea className="h-full w-full">
            <MobileMessagesView
              threads={filteredThreads}
              selectedThread={selectedThread}
              setSelectedThread={(thread) => {
                setSelectedThread(thread);
                setShowMobileThreadList(false);
              }}
              profiles={profiles}
              currentUserProfile={currentUserProfile}
            />
          </ScrollArea>
        </div>

        {/* Conversation panel */}
        <div
          className="absolute inset-0 bg-background"
          style={{
            transform: showMobileThreadList ? "translateX(100%)" : "translateX(0)",
            transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1)",
            backfaceVisibility: "hidden",
          }}
        >
          <DesktopMessagesView
            threads={filteredThreads}
            selectedThread={selectedThread}
            setSelectedThread={setSelectedThread}
            profiles={profiles}
            currentUserProfile={currentUserProfile}
            threadMessages={threadMessages}
            currentUserId={currentUserId}
            isMobile={isMobile}
            onSendMessage={handleSendMessage}
            onPromptUsed={handlePromptUsed}
            onBack={handleBackToThreadList}
            onUserBlocked={handleUserBlocked}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <h1 className="text-2xl font-display font-bold text-foreground px-4 py-6">Messages</h1>

      <DesktopMessagesView
        threads={filteredThreads}
        selectedThread={selectedThread}
        setSelectedThread={setSelectedThread}
        profiles={profiles}
        currentUserProfile={currentUserProfile}
        threadMessages={threadMessages}
        currentUserId={currentUserId}
        isMobile={isMobile}
        onSendMessage={handleSendMessage}
        onPromptUsed={handlePromptUsed}
        onUserBlocked={handleUserBlocked}
      />
    </div>
  );
};