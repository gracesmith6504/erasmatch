
import { Profile } from "@/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessagesTabs } from "./MessagesTabs";
import { ThreadsList } from "./ThreadsList";
import { GroupChatsList } from "./GroupChatsList";
import { CityList } from "./CityList";
import { getInitials } from "./utils/messageUtils";

interface MobileMessagesViewProps {
  threads: any[];
  selectedThread: any;
  setSelectedThread: (thread: any) => void;
  profiles: Profile[];
  currentUserProfile: Profile | null;
  handleSelectGroupChat: (universityName: string) => void;
  selectedGroupChat: string | null;
  handleSelectCityChat: (cityName: string) => void;
  selectedCityChat: string | null;
  activeTab: "direct" | "groups" | "cities";
  setActiveTab: (tab: "direct" | "groups" | "cities") => void;
}

export const MobileMessagesView = ({
  threads,
  selectedThread,
  setSelectedThread,
  profiles,
  currentUserProfile,
  handleSelectGroupChat,
  selectedGroupChat,
  handleSelectCityChat,
  selectedCityChat,
  activeTab,
  setActiveTab,
}: MobileMessagesViewProps) => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      
      <MessagesTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        directContent={
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ThreadsList 
              threads={threads} 
              selectedThread={selectedThread} 
              onSelectThread={setSelectedThread}
              getInitials={getInitials}
            />
          </div>
        }
        groupsContent={
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <GroupChatsList 
              profiles={profiles}
              currentUserProfile={currentUserProfile}
              onSelectGroupChat={handleSelectGroupChat}
              selectedGroupChat={selectedGroupChat}
            />
          </div>
        }
        citiesContent={
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <CityList 
              profiles={profiles}
              currentUserProfile={currentUserProfile}
              onSelectCityChat={handleSelectCityChat}
              selectedCityChat={selectedCityChat}
            />
          </div>
        }
      />
    </div>
  );
};
