
import { useState } from "react";
import { Profile } from "@/types";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { GroupChatsList } from "@/components/messages/GroupChatsList";
import { CityList } from "@/components/messages/CityList";
import { GroupChatPanel } from "@/components/messages/GroupChatPanel";
import { CityPanel } from "@/components/messages/CityPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const Groups = () => {
  const { profiles } = useData();
  const { currentUserId } = useAuth();
  const isMobile = useIsMobile();
  
  const [activeTab, setActiveTab] = useState<"university" | "city">("university");
  const [selectedGroupChat, setSelectedGroupChat] = useState<string | null>(null);
  const [selectedCityChat, setSelectedCityChat] = useState<string | null>(null);
  
  // Get the current user's profile
  const currentUserProfile = profiles.find(profile => profile.id === currentUserId) || null;
  
  const handleSelectGroupChat = (universityName: string) => {
    console.log("Selecting group chat:", universityName);
    setSelectedGroupChat(universityName || null);
    setSelectedCityChat(null);
    if (universityName) {
      setActiveTab("university");
    }
  };

  const handleSelectCityChat = (cityName: string) => {
    console.log("Selecting city chat:", cityName);
    setSelectedCityChat(cityName || null);
    setSelectedGroupChat(null);
    if (cityName) {
      setActiveTab("city");
    }
  };

  // Handle mobile view - show either the chat list or the selected chat
  if (isMobile && (selectedGroupChat || selectedCityChat)) {
    // Show the selected chat on mobile
    return (
      <div className="max-w-7xl mx-auto h-[calc(100vh-128px)] py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Groups</h1>
        
        {selectedGroupChat ? (
          <div className="flex flex-col w-full h-full">
            <div className="border-b p-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedGroupChat(null)}
                className="mr-2"
              >
                Back
              </Button>
            </div>
            <GroupChatPanel 
              universityName={selectedGroupChat}
              currentUserId={currentUserId!}
              profiles={profiles}
            />
          </div>
        ) : selectedCityChat ? (
          <div className="flex flex-col w-full h-full">
            <div className="border-b p-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedCityChat(null)}
                className="mr-2"
              >
                Back
              </Button>
            </div>
            <CityPanel
              cityName={selectedCityChat}
              currentUserId={currentUserId!}
              profiles={profiles}
            />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-128px)] py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Groups</h1>
      
      <div className="flex flex-1 bg-white rounded-lg shadow overflow-hidden">
        {/* Groups list */}
        <div className={isMobile ? "w-full" : "w-1/3 border-r"}>
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "university" | "city")}
            className="h-full flex flex-col"
          >
            <TabsList className="w-full">
              <TabsTrigger value="university" className="flex-1">
                University
              </TabsTrigger>
              <TabsTrigger value="city" className="flex-1">
                City
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="university" className="flex-1 overflow-y-auto">
              <GroupChatsList 
                profiles={profiles}
                currentUserProfile={currentUserProfile}
                onSelectGroupChat={handleSelectGroupChat}
                selectedGroupChat={selectedGroupChat}
              />
            </TabsContent>
            
            <TabsContent value="city" className="flex-1 overflow-y-auto">
              <CityList 
                profiles={profiles}
                currentUserProfile={currentUserProfile}
                onSelectCityChat={handleSelectCityChat}
                selectedCityChat={selectedCityChat}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Conversation area (desktop only) */}
        {!isMobile && (
          <div className="w-2/3">
            {selectedGroupChat ? (
              <GroupChatPanel 
                universityName={selectedGroupChat}
                currentUserId={currentUserId!}
                profiles={profiles}
              />
            ) : selectedCityChat ? (
              <CityPanel
                cityName={selectedCityChat}
                currentUserId={currentUserId!}
                profiles={profiles}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <p className="text-gray-500 mb-4">Select a group chat from the left</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
