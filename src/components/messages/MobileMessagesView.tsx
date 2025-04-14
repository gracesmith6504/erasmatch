
import { ChatThread, Profile } from "@/types";
import { ThreadsList } from "./ThreadsList";
import { getInitials } from "./utils/messageUtils";

interface MobileMessagesViewProps {
  threads: ChatThread[];
  selectedThread: ChatThread | null;
  setSelectedThread: (thread: ChatThread | null) => void;
  profiles: Profile[];
  currentUserProfile: Profile | null;
  unreadThreadIds?: string[];
  markThreadAsRead?: (threadId: string) => void;
}

export const MobileMessagesView = ({
  threads,
  selectedThread,
  setSelectedThread,
  profiles,
  currentUserProfile,
  unreadThreadIds = [],
  markThreadAsRead = () => {},
}: MobileMessagesViewProps) => {
  // Handler to select thread and mark as read
  const handleSelectThread = (thread: ChatThread) => {
    setSelectedThread(thread);
    
    // Mark the thread as read when selected
    if (unreadThreadIds.includes(thread.partner.id)) {
      markThreadAsRead(thread.partner.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-128px)] py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden flex-1">
        <ThreadsList 
          threads={threads}
          selectedThread={selectedThread} 
          onSelectThread={handleSelectThread}
          getInitials={getInitials}
          unreadThreadIds={unreadThreadIds}
        />
      </div>
    </div>
  );
};
