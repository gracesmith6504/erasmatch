
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { useOnboardingBanner } from "@/hooks/useOnboardingBanner";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileContext } from "@/components/profile/ProfileContext";
import { GroupChatPanel } from "@/components/messages/GroupChatPanel";
import { CityPanel } from "@/components/messages/CityPanel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, GraduationCap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const Groups = () => {
  const location = useLocation();
  const currentUserId = localStorage.getItem('userId'); // This is how the app gets the user ID
  const { showBanner, cityName } = useOnboardingBanner(currentUserId);
  
  const { profiles } = useData();
  const { currentUserId: authCurrentUserId } = useAuth();
  const { profile: currentUserProfile } = useProfileContext();
  const isMobile = useIsMobile();
  
  const [selectedGroupChat, setSelectedGroupChat] = useState<string | null>(null);
  const [selectedCityChat, setSelectedCityChat] = useState<string | null>(null);
  
  // Improved refresh logic for first visit to groups page
  useEffect(() => {
    // Check if this is the first visit to the groups page
    const hasVisitedGroups = sessionStorage.getItem("hasVisitedGroups");
    const fromOnboarding = sessionStorage.getItem("justCompletedOnboarding");
    
    if (!hasVisitedGroups || fromOnboarding === "true") {
      // Mark that we've visited groups page
      sessionStorage.setItem("hasVisitedGroups", "true");
      
      // Show a loading toast to indicate refresh is happening
      toast.info("Loading group chats...");
      
      // Force a page reload to ensure group chats load properly
      window.location.reload();
    }
  }, []);
  
  // Store onboarding completion info when coming from onboarding
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("from") === "onboarding") {
      sessionStorage.setItem("justCompletedOnboarding", "true");
      // City will be fetched in the hook
    }
  }, [location]);
  
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

  // Log when profile updates to verify we're getting fresh data
  useEffect(() => {
    console.log("Groups component received updated profile:", currentUserProfile);
  }, [currentUserProfile]);

  // Show full-screen chat view when a chat is selected
  if (selectedGroupChat || selectedCityChat) {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col">
        <div className="flex-1 overflow-hidden">
          {selectedGroupChat ? (
            <GroupChatPanel 
              universityName={selectedGroupChat}
              currentUserId={authCurrentUserId!}
              profiles={profiles}
              onBack={handleBack}
              isFullScreen={true}
            />
          ) : selectedCityChat ? (
            <CityPanel
              cityName={selectedCityChat}
              currentUserId={authCurrentUserId!}
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
    <div className="max-w-7xl mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8">
      {showBanner && (
        <WelcomeBanner cityName={cityName} variant="groups" />
      )}
      
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Join Group Chats</h1>
      
      <div className="space-y-4 md:space-y-6">
        {/* University Card */}
        {currentUserProfile?.university && (
          <Card 
            className="rounded-3xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => handleSelectGroupChat(currentUserProfile.university!)}
          >
            <div className="bg-gradient-to-r from-purple-700 to-indigo-500 text-white p-6 md:p-8 relative">
              <div className="absolute top-4 right-4 bg-white/20 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                {profiles.filter(p => p.university === currentUserProfile.university).length} students
              </div>
              <GraduationCap className="w-12 h-12 md:w-16 md:h-16 mb-4 opacity-70 absolute right-6 md:right-8 top-6 md:top-8" />
              <h2 className="text-4xl md:text-5xl font-bold mb-2">Your University</h2>
              <p className="text-xl md:text-2xl opacity-90 mb-4">
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
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 md:p-8 relative">
              <div className="absolute top-4 right-4 bg-white/20 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                {profiles.filter(p => p.city === currentUserProfile.city).length} students
              </div>
              <MapPin className="w-12 h-12 md:w-16 md:h-16 mb-4 opacity-70 absolute right-6 md:right-8 top-6 md:top-8" />
              <h2 className="text-4xl md:text-5xl font-bold mb-2">Your City</h2>
              <p className="text-xl md:text-2xl opacity-90 mb-4">
                Group chat for<br/>{currentUserProfile.city}
              </p>
            </div>
          </Card>
        )}
        
        {!currentUserProfile?.university && !currentUserProfile?.city && (
          <div className="text-center p-6 md:p-8 bg-gray-50 rounded-xl">
            <p className="text-lg text-gray-600">
              Set your university and city in your profile to join group chats.
            </p>
            <Button 
              className="mt-4 py-2.5 md:py-2"
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
