
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
    <div className="w-full overflow-hidden px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
