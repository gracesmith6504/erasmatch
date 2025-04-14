
import { Profile } from "@/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessagesTabs } from "./MessagesTabs";
import { ThreadsList } from "./ThreadsList";
import { CityList } from "./CityList";

interface MobileMessagesViewProps {
  threads: any[];
  selectedThread: any;
  setSelectedThread: (thread: any) => void;
  getInitials: (name: string | null) => string;
  profiles: Profile[];
  currentUserProfile: Profile | null;
  handleSelectCityChat: (cityName: string) => void;
  selectedCityChat: string | null;
  activeTab: "direct" | "cities";
  setActiveTab: (tab: "direct" | "cities") => void;
}

export const MobileMessagesView = ({
  threads,
  selectedThread,
  setSelectedThread,
  getInitials,
  profiles,
  currentUserProfile,
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
