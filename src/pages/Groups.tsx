
import { useState } from "react";
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

  // Handle mobile view - show either the chat list or the selected chat
  if (isMobile && (selectedGroupChat || selectedCityChat)) {
    // Show the selected chat on mobile
    return (
      <div className="max-w-7xl mx-auto h-[calc(100vh-128px)] py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setSelectedGroupChat(null);
              setSelectedCityChat(null);
            }}
            className="flex items-center gap-1"
          >
            Back
          </Button>
        </div>
        
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
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
          ) : null}
        </div>
      </div>
    );
  }

  // Cards view for listing available groups
  if (isMobile || (!selectedGroupChat && !selectedCityChat)) {
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
  }
  
  // Desktop view with selected chat
  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-128px)] py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Groups</h1>
      
      <div className="flex flex-1 bg-white rounded-lg shadow overflow-hidden">
        {/* Groups list */}
        <div className="w-1/3 border-r">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Your Group Chats</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {/* University groups */}
              {currentUserProfile?.university && (
                <div 
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedGroupChat === currentUserProfile.university ? 'bg-gray-50 border-l-4 border-l-blue-500' : ''}`}
                  onClick={() => handleSelectGroupChat(currentUserProfile.university!)}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-700 to-indigo-500 text-white flex items-center justify-center mr-3">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">University Chat</h3>
                      <p className="text-sm text-gray-500 truncate">{currentUserProfile.university}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* City groups */}
              {currentUserProfile?.city && (
                <div 
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedCityChat === currentUserProfile.city ? 'bg-gray-50 border-l-4 border-l-blue-500' : ''}`}
                  onClick={() => handleSelectCityChat(currentUserProfile.city!)}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white flex items-center justify-center mr-3">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">City Chat</h3>
                      <p className="text-sm text-gray-500 truncate">{currentUserProfile.city}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {!currentUserProfile?.university && !currentUserProfile?.city && (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500">
                    Set your university and city in your profile to join group chats.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Conversation area */}
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
      </div>
    </div>
  );
};

export default Groups;
