
import { Profile } from "@/types";
import { ThreadsList } from "./ThreadsList";
import { getInitials } from "./utils/messageUtils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      
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
