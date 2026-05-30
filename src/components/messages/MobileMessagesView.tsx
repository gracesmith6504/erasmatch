import { Profile } from "@/types";
import { ThreadsList } from "./ThreadsList";
import { getInitials } from "./utils/messageUtils";

interface MobileMessagesViewProps {
  threads: any[];
  selectedThread: any;
  setSelectedThread: (thread: any) => void;
  profiles: Profile[];
  currentUserProfile: Profile | null;
}

export const MobileMessagesView = ({
  threads,
  selectedThread,
  setSelectedThread,
  profiles,
  currentUserProfile,
}: MobileMessagesViewProps) => {
  return (
    <div className="w-full overflow-hidden px-4 pt-5 pb-4">
      <h1 className="text-2xl font-display font-bold text-foreground mb-3 tracking-tight">Messages</h1>
      
      
      <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
        <ThreadsList 
          threads={threads} 
          selectedThread={selectedThread} 
          onSelectThread={setSelectedThread}
          getInitials={getInitials}
        />
      </div>
    </div>
  );
};