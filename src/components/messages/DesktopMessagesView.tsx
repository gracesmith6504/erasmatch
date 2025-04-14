
import { Profile, ChatThread } from "@/types";
import { DirectMessagePanel } from "./DirectMessagePanel";
import { ThreadsList } from "./ThreadsList";
import { Button } from "@/components/ui/button";
import { getInitials } from "./utils/messageUtils";

interface DesktopMessagesViewProps {
  threads: ChatThread[];
  selectedThread: ChatThread | null;
  setSelectedThread: (thread: ChatThread | null) => void;
  profiles: Profile[];
  currentUserProfile: Profile | null;
  threadMessages: any[];
  currentUserId: string;
  isMobile: boolean;
  onSendMessage: (receiverId: string, content: string) => Promise<void>;
  onPromptUsed?: () => void;
  unreadThreadIds?: string[];  // Add prop for unread threads
  markThreadAsRead?: (threadId: string) => void;  // Add function to mark thread as read
}

export const DesktopMessagesView = ({
  threads,
  selectedThread,
  setSelectedThread,
  profiles,
  currentUserProfile,
  threadMessages,
  currentUserId,
  isMobile,
  onSendMessage,
  onPromptUsed = () => {},
  unreadThreadIds = [],  // Default to empty array
  markThreadAsRead = () => {},  // Default to empty function
}: DesktopMessagesViewProps) => {
  // Handler to select thread and mark as read
  const handleSelectThread = (thread: ChatThread) => {
    setSelectedThread(thread);
    
    // Mark the thread as read when selected
    if (unreadThreadIds.includes(thread.partner.id)) {
      markThreadAsRead(thread.partner.id);
    }
  };

  return (
    <div className="flex flex-1 bg-white rounded-lg shadow overflow-hidden">
      {/* Thread list */}
      <div className="w-full md:w-1/3 border-r flex flex-col">
        <ThreadsList 
          threads={threads} 
          selectedThread={selectedThread} 
          onSelectThread={handleSelectThread}
          getInitials={getInitials}
          unreadThreadIds={unreadThreadIds}
        />
      </div>
      
      {/* Conversation area */}
      {selectedThread ? (
        <DirectMessagePanel
          thread={selectedThread}
          messages={threadMessages}
          currentUserId={currentUserId}
          currentUserProfile={currentUserProfile}
          isMobile={isMobile}
          onBack={() => setSelectedThread(null)}
          onSendMessage={onSendMessage}
          onPromptUsed={onPromptUsed}
        />
      ) : (
        <div className="hidden md:flex flex-col w-2/3 items-center justify-center p-4">
          <p className="text-gray-500 mb-4">Select a conversation from the left</p>
        </div>
      )}
    </div>
  );
};
