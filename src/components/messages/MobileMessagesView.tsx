import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Message, Profile } from "@/types";
import { MobileMessagesView } from "./MobileMessagesView";
import { DesktopMessagesView } from "./DesktopMessagesView";
import { useMessageState } from "@/hooks/useMessageState";
import { useInitialUserSelection } from "@/hooks/useInitialUserSelection";
import { createMessageHandler } from "./utils/messageUtils";
import { MobileBottomNav } from "../layout/navbar/MobileBottomNav"; // ✅ Adjust path as needed
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
    console.log("Prompt was used - will reset state after message is sent");
  };

  const handleBackToThreadList = () => {
    setShowMobileThreadList(true);
  };

  // ✅ MOBILE: Only show nav when thread list is open
  if (isMobile) {
    if (showMobileThreadList) {
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

          <MobileBottomNav isActive={() => false} /> {/* ✅ Show nav here */}
        </div>
      );
    } else {
      return (
        <div className="h-full flex flex-col overflow-hidden w-full">
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
            onBack={handleBackToThreadList}
          />
        </div>
      );
    }
  }

  // ✅ DESKTOP: Always show full view
  return (
    <div className="h-full flex flex-col overflow-hidden w-full">
      <h1 className="text-2xl font-bold text-gray-900 px-4 py-6">Messages</h1>

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
      />
    </div>
  );
};
