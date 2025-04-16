
import { Profile, ChatThread } from "@/types";
import { DirectMessagePanel } from "./DirectMessagePanel";
import { ThreadsList } from "./ThreadsList";
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
  onBack?: () => void;
  onMessagesRead?: () => void; // New prop
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
  onBack,
  onMessagesRead = () => {}, // Default to noop function
}: DesktopMessagesViewProps) => {
  return (
    <div className="flex flex-1 bg-white rounded-lg shadow overflow-hidden">
      {/* Thread list - hidden on mobile when thread selected */}
      {(!isMobile || !selectedThread) && (
        <div className="w-full md:w-1/3 border-r flex flex-col">
          <ThreadsList 
            threads={threads} 
            selectedThread={selectedThread} 
            onSelectThread={setSelectedThread}
            getInitials={getInitials}
          />
        </div>
      )}
      
      {/* Conversation area - full width on mobile */}
      {selectedThread ? (
        <DirectMessagePanel
          thread={selectedThread}
          messages={threadMessages}
          currentUserId={currentUserId}
          currentUserProfile={currentUserProfile}
          isMobile={isMobile}
          onBack={onBack}
          onSendMessage={onSendMessage}
          onPromptUsed={onPromptUsed}
          onMessagesRead={onMessagesRead}
        />
      ) : (
        <div className="hidden md:flex flex-col w-2/3 items-center justify-center p-4">
          <p className="text-gray-500 mb-4">Select a conversation from the left</p>
        </div>
      )}
    </div>
  );
};
