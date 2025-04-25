import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Message, Profile } from "@/types";
import { MobileMessagesView } from "./MobileMessagesView";
import { DesktopMessagesView } from "./DesktopMessagesView";
import { useMessageState } from "@/hooks/useMessageState";
import { useInitialUserSelection } from "@/hooks/useInitialUserSelection";
import { createMessageHandler } from "./utils/messageUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MobileBottomNav } from "@/components/layout/navbar/MobileBottomNav";
import { useNavigation } from "@/components/layout/navbar/useNavigation";

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
  const { isActive } = useNavigation();
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

  const handleSendMessage = createMessageHandler(
    onSendMessage,
    setMessagesSent,
    setRefreshKey,
    () => {}
  );

  const handlePromptUsed = () => {
    console.log("Prompt used.");
  };

  const handleBackToThreadList = () => {
    setShowMobileThreadList(true);
  };

  // ✅ Mobile - show message thread list
  if (isMobile && showMobileThreadList) {
    return (
      <div className="relative h-full w-full">
        <ScrollArea className="h-full w-full pb-20">
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

        {/* ✅ Show Mobile Nav ONLY when browsing thread list */}
        <MobileBottomNav isActive={isActive} />
      </div>
    );
  }

// ✅ Show chat on mobile OR desktop
return (
  <div className="h-full flex flex-col overflow-hidden w-full">
    {isMobile && selectedThread ? (
      <DesktopMessagesView
        threads={threads}
        selectedThread={selectedThread}
        setSelectedThread={setSelectedThread}
        profiles={profiles}
        currentUserProfile={currentUserProfile}
        threadMessages={threadMessages}
        currentUserId={currentUserId}
        isMobile={true}
        onSendMessage={handleSendMessage}
        onPromptUsed={handlePromptUsed}
        onBack={handleBackToThreadList}
      />
    ) : (
      <>
        <h1 className="text-2xl font-bold text-gray-900 px-4 py-6">Messages</h1>
        <DesktopMessagesView
          threads={threads}
          selectedThread={selectedThread}
          setSelectedThread={setSelectedThread}
          profiles={profiles}
          currentUserProfile={currentUserProfile}
          threadMessages={threadMessages}
          currentUserId={currentUserId}
          isMobile={false}
          onSendMessage={handleSendMessage}
          onPromptUsed={handlePromptUsed}
        />
      </>
    )}
  </div>
);

};
