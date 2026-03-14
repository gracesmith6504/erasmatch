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

  useEffect(() => {
    if (isMobile && selectedThread) {
      setShowMobileThreadList(false);
    }
  }, [selectedThread, isMobile]);
  
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

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {!isMobile && <h1 className="text-2xl font-display font-bold text-foreground px-4 py-6">Messages</h1>}
      
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