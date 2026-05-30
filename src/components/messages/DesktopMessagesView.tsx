import { Profile, ChatThread } from "@/types";
import { DirectMessagePanel } from "./DirectMessagePanel";
import { ThreadsList } from "./ThreadsList";
import { getInitials } from "./utils/messageUtils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  onUserBlocked?: () => void;
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
  onUserBlocked,
}: DesktopMessagesViewProps) => {
  return (
    <div className="flex flex-1 bg-card rounded-2xl shadow-soft border border-border overflow-hidden h-full">
      {(!isMobile || !selectedThread) && (
        <div className="w-full md:w-1/3 border-r border-border flex flex-col h-full overflow-hidden">
          <ScrollArea className="flex-1 overflow-y-auto bg-background">
            <ThreadsList 
              threads={threads} 
              selectedThread={selectedThread} 
              onSelectThread={setSelectedThread}
              getInitials={getInitials}
            />
          </ScrollArea>
        </div>
      )}
      
      {selectedThread ? (
      <div className="w-full md:w-2/3 flex flex-col h-full">
        <DirectMessagePanel
          thread={selectedThread}
          messages={threadMessages}
          currentUserId={currentUserId}
          currentUserProfile={currentUserProfile}
          isMobile={isMobile}
          onBack={onBack}
          onSendMessage={onSendMessage}
          onPromptUsed={onPromptUsed}
          onUserBlocked={onUserBlocked}
        />
      </div>
      ) : (
        <div className="hidden md:flex flex-col w-2/3 items-center justify-center p-4">
          <p className="text-muted-foreground mb-4">Select a conversation from the left</p>
        </div>
      )}
    </div>
  );
};
