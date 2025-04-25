
import { useIsMobile } from "@/hooks/use-mobile";
import { Message, Profile } from "@/types";
import { MobileMessagesView } from "./MobileMessagesView";
import { DesktopMessagesView } from "./DesktopMessagesView";
import { useMessageState } from "@/hooks/useMessageState";
import { useInitialUserSelection } from "@/hooks/useInitialUserSelection";
import { createMessageHandler } from "./utils/messageUtils";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  // Get message state from hook
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

  // Toggle mobile thread list visibility based on selection
  useEffect(() => {
    if (isMobile && selectedThread) {
      setShowMobileThreadList(false);
    }
  }, [selectedThread, isMobile]);
  
  // Handle initial user selection
  useInitialUserSelection(
    initialSelectedUser,
    profiles,
    threads,
    selectedThread,
    isMobile,
    "direct",
    setSelectedThread,
    () => {},
    () => {},
    () => {},
    refreshKey
  );

  // Custom wrapper for onSendMessage to ensure state updates properly
  const handleSendMessage = createMessageHandler(
    onSendMessage, 
    setMessagesSent, 
    setRefreshKey, 
    () => {}
  );

  // Handle prompt selection - reset state
  const handlePromptUsed = () => {
    console.log("Prompt was used - will reset state after message is sent");
  };

  // Handler for going back to thread list on mobile - only change thread list visibility
  const handleBackToThreadList = () => {
    setShowMobileThreadList(true);
  };

  // Show mobile thread list when we want to display the thread list on mobile
  if (isMobile && showMobileThreadList) {
    return (
      <ScrollArea className="h-full w-full">
        <MobileMessagesView
          threads={threads}
          selectedThread={selectedThread}
          setSelectedThread={(thread) => {
            setSelectedThread(thread);
            setShowMobileThreadList(false);
          }}
          profiles={profiles}
          currentUserProfile={currentUserProfile}
        />
      </ScrollArea>
    );
  }

  // Show desktop view or conversation on mobile
  return (
    <div className="h-full flex flex-col overflow-hidden w-full">
      {!isMobile && <h1 className="text-2xl font-bold text-gray-900 px-4 py-6">Messages</h1>}
      
      <DesktopMessagesView
        threads={threads}
        selectedThread={selectedThread}
        setSelectedThread={setSelectedThread}
        profiles={profiles}
        currentUserProfile={currentUserProfile}
        threadMessages={threadMessages}
        currentUserId={currentUserId}
        isMobile={isMobile}
        onSendMessage={handleSendMessage}
        onPromptUsed={handlePromptUsed}
        onBack={isMobile ? handleBackToThreadList : undefined}
      />
    </div>
  );
};
