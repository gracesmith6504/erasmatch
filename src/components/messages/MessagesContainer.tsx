
import { useIsMobile } from "@/hooks/use-mobile";
import { Message, Profile } from "@/types";
import { MobileMessagesView } from "./MobileMessagesView";
import { DesktopMessagesView } from "./DesktopMessagesView";
import { useMessageState } from "@/hooks/useMessageState";
import { useInitialUserSelection } from "@/hooks/useInitialUserSelection";
import { createMessageHandler } from "./utils/messageUtils";

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

  // Show mobile view when no conversation selected on mobile
  if (isMobile && !selectedThread) {
    return (
      <MobileMessagesView
        threads={threads}
        selectedThread={selectedThread}
        setSelectedThread={setSelectedThread}
        profiles={profiles}
        currentUserProfile={currentUserProfile}
      />
    );
  }

  // Show desktop view or conversation on mobile
  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-128px)] py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      
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
