
import { useState, useEffect } from "react";
import { Profile } from "@/types";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { GroupChatsList } from "@/components/messages/GroupChatsList";
import { CityList } from "@/components/messages/CityList";
import { GroupChatPanel } from "@/components/messages/GroupChatPanel";
import { CityPanel } from "@/components/messages/CityPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, GraduationCap } from "lucide-react";

const Groups = () => {
  const { profiles } = useData();
  const { currentUserId } = useAuth();
  const isMobile = useIsMobile();
  
  const [selectedGroupChat, setSelectedGroupChat] = useState<string | null>(null);
  const [selectedCityChat, setSelectedCityChat] = useState<string | null>(null);
  
  // Get the current user's profile
  const currentUserProfile = profiles.find(profile => profile.id === currentUserId) || null;
  
  const handleSelectGroupChat = (universityName: string) => {
    console.log("Selecting group chat:", universityName);
    setSelectedGroupChat(universityName || null);
    setSelectedCityChat(null);
  };

  const handleSelectCityChat = (cityName: string) => {
    console.log("Selecting city chat:", cityName);
    setSelectedCityChat(cityName || null);
    setSelectedGroupChat(null);
  };

  const handleBack = () => {
    setSelectedGroupChat(null);
    setSelectedCityChat(null);
  };

  // Show full-screen chat view when a chat is selected
  if (selectedGroupChat || selectedCityChat) {
    return (
      <div className="max-w-7xl mx-auto h-[calc(100vh-128px)] py-4 px-2 sm:px-4 flex flex-col">
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
          {selectedGroupChat ? (
            <GroupChatPanel 
              universityName={selectedGroupChat}
              currentUserId={currentUserId!}
              profiles={profiles}
              onBack={handleBack}
              isFullScreen={true}
            />
          ) : selectedCityChat ? (
            <CityPanel
              cityName={selectedCityChat}
              currentUserId={currentUserId!}
              profiles={profiles}
              onBack={handleBack}
              isFullScreen={true}
            />
          ) : null}
        </div>
      </div>
    );
  }

  // Cards view for listing available groups
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">Join Group Chats</h1>
      
      <div className="space-y-6">
        {/* University Card */}
        {currentUserProfile?.university && (
          <Card 
            className="rounded-3xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => handleSelectGroupChat(currentUserProfile.university!)}
          >
            <div className="bg-gradient-to-r from-purple-700 to-indigo-500 text-white p-8 relative">
              <div className="absolute top-4 right-4 bg-white/20 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                {profiles.filter(p => p.university === currentUserProfile.university).length} students
              </div>
              <GraduationCap className="w-16 h-16 mb-4 opacity-70 absolute right-8 top-8" />
              <h2 className="text-5xl font-bold mb-2">Your University</h2>
              <p className="text-2xl opacity-90 mb-4">
                Chat with students at<br/>{currentUserProfile.university}
              </p>
            </div>
          </Card>
        )}
        
        {/* City Card */}
        {currentUserProfile?.city && (
          <Card 
            className="rounded-3xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => handleSelectCityChat(currentUserProfile.city!)}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-8 relative">
              <div className="absolute top-4 right-4 bg-white/20 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                {profiles.filter(p => p.city === currentUserProfile.city).length} students
              </div>
              <MapPin className="w-16 h-16 mb-4 opacity-70 absolute right-8 top-8" />
              <h2 className="text-5xl font-bold mb-2">Your City</h2>
              <p className="text-2xl opacity-90 mb-4">
                Group chat for<br/>{currentUserProfile.city}
              </p>
            </div>
          </Card>
        )}
        
        {!currentUserProfile?.university && !currentUserProfile?.city && (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-600">
              Set your university and city in your profile to join group chats.
            </p>
            <Button 
              className="mt-4"
              onClick={() => window.location.href = "/profile"}
            >
              Update Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
