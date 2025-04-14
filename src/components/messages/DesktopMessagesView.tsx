
import { Profile, ChatThread } from "@/types";
import { DirectMessagePanel } from "./DirectMessagePanel";
import { ThreadsList } from "./ThreadsList";
import { Button } from "@/components/ui/button";

interface DesktopMessagesViewProps {
  threads: ChatThread[];
  selectedThread: ChatThread | null;
  setSelectedThread: (thread: ChatThread | null) => void;
  getInitials: (name: string | null) => string;
  profiles: Profile[];
  currentUserProfile: Profile | null;
  threadMessages: any[];
  currentUserId: string;
  isMobile: boolean;
  onSendMessage: (receiverId: string, content: string) => void;
}

export const DesktopMessagesView = ({
  threads,
  selectedThread,
  setSelectedThread,
  getInitials,
  profiles,
  currentUserProfile,
  threadMessages,
  currentUserId,
  isMobile,
  onSendMessage,
}: DesktopMessagesViewProps) => {
  return (
    <div className="flex flex-1 bg-white rounded-lg shadow overflow-hidden">
      {/* Thread list */}
      <div className="w-full md:w-1/3 border-r flex flex-col">
        <ThreadsList 
          threads={threads} 
          selectedThread={selectedThread} 
          onSelectThread={(thread) => setSelectedThread(thread)}
          getInitials={getInitials}
        />
      </div>
      
      {/* Conversation area */}
      {selectedThread ? (
        <DirectMessagePanel
          thread={selectedThread}
          messages={threadMessages}
          currentUserId={currentUserId}
          isMobile={isMobile}
          onBack={() => setSelectedThread(null)}
          onSendMessage={onSendMessage}
        />
      ) : (
        <div className="hidden md:flex flex-col w-2/3 items-center justify-center p-4">
          <p className="text-gray-500 mb-4">Select a conversation from the left</p>
        </div>
      )}
    </div>
  );
};
