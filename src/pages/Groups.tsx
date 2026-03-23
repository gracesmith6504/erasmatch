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

const Groups = () => {
  const location = useLocation();
  const { currentUserId } = useAuth();
  const { showBanner, cityName } = useOnboardingBanner(currentUserId);
  
  const { profiles } = useData();
  const { profile: currentUserProfile } = useProfileContext();
  const isMobile = useIsMobile();
  
  const [selectedGroupChat, setSelectedGroupChat] = useState<string | null>(null);
  const [selectedCityChat, setSelectedCityChat] = useState<string | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("from") === "onboarding") {
      // Clean up onboarding flag — no reload needed
      sessionStorage.removeItem("justCompletedOnboarding");
    }
  }, [location]);
  
  const handleSelectGroupChat = (universityName: string) => {
    setSelectedGroupChat(universityName || null);
    setSelectedCityChat(null);
  };

  const handleSelectCityChat = (cityName: string) => {
    setSelectedCityChat(cityName || null);
    setSelectedGroupChat(null);
  };

  const handleBack = () => {
    setSelectedGroupChat(null);
    setSelectedCityChat(null);
  };

  if (selectedGroupChat || selectedCityChat) {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col">
        <div className="flex-1 overflow-hidden">
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

  return (
    <div className="max-w-7xl mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8">
      {showBanner && (
        <WelcomeBanner cityName={cityName} variant="groups" />
      )}
      
      <h1 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-6 md:mb-8">Join Group Chats</h1>
      
      <div className="space-y-4 md:space-y-6">
        {currentUserProfile?.university && (
          <Card 
            className="rounded-2xl overflow-hidden cursor-pointer hover:shadow-card transition-all border-border" 
            onClick={() => handleSelectGroupChat(currentUserProfile.university!)}
          >
            <div className="bg-gradient-to-r from-erasmatch-purple to-erasmatch-blue text-accent-foreground p-6 md:p-8 relative">
              <div className="absolute top-4 right-4 bg-background/20 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                {profiles.filter(p => p.university === currentUserProfile.university).length} students
              </div>
              <GraduationCap className="w-12 h-12 md:w-16 md:h-16 mb-4 opacity-70 absolute right-6 md:right-8 top-6 md:top-8" />
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">Your University</h2>
              <p className="text-xl md:text-2xl opacity-90 mb-4">
                Chat with students at<br/>{currentUserProfile.university}
              </p>
            </div>
          </Card>
        )}
        
        {currentUserProfile?.city && (
          <Card 
            className="rounded-2xl overflow-hidden cursor-pointer hover:shadow-card transition-all border-border" 
            onClick={() => handleSelectCityChat(currentUserProfile.city!)}
          >
            <div className="bg-gradient-to-r from-erasmatch-green to-erasmatch-blue text-accent-foreground p-6 md:p-8 relative">
              <div className="absolute top-4 right-4 bg-background/20 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                {profiles.filter(p => p.city === currentUserProfile.city).length} students
              </div>
              <MapPin className="w-12 h-12 md:w-16 md:h-16 mb-4 opacity-70 absolute right-6 md:right-8 top-6 md:top-8" />
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">Your City</h2>
              <p className="text-xl md:text-2xl opacity-90 mb-4">
                Group chat for<br/>{currentUserProfile.city}
              </p>
            </div>
          </Card>
        )}
        
        {!currentUserProfile?.university && !currentUserProfile?.city && (
          <div className="text-center p-6 md:p-8 bg-secondary rounded-2xl">
            <p className="text-lg text-muted-foreground">
              Set your university and city in your profile to join group chats.
            </p>
            <Button 
              className="mt-4 rounded-full bg-foreground text-background hover:bg-foreground/90"
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