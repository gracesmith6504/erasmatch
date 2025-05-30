
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { StudentStoriesSection } from "@/components/home/StudentStoriesSection";
import { GroupChatSection } from "@/components/home/GroupChatSection";
import { CommunitySection } from "@/components/home/CommunitySection";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Ensure proper SEO metadata for homepage
  useEffect(() => {
    document.title = "ErasMatch - Connect with Erasmus Students";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Connect with fellow Erasmus students before you arrive. Find study buddies, join group chats, and make friends for your exchange experience.');
    }
  }, []);

  // Redirect handler - go to students page if logged in, auth page if not
  const handleFindStudents = () => {
    if (isAuthenticated) {
      navigate("/students");
    } else {
      navigate("/auth?mode=signup");
    }
  };

  const handleJoinChats = () => {
    if (isAuthenticated) {
      navigate("/groups");
    } else {
      navigate("/auth?mode=signup");
    }
  };

  // Redirecting to students page
  const handlePlanning = () => {
    if (isAuthenticated) {
      navigate("/students");
    } else {
      navigate("/auth?mode=signup");
    }
  };

  return (
    <div className="animate-fade-in min-h-screen">
      <HeroSection 
        handleFindStudents={handleFindStudents}
        handleJoinChats={handleJoinChats}
        handlePlanning={handlePlanning}
      />
      <FeaturesSection />
      <HowItWorksSection />
      <StudentStoriesSection />
      <GroupChatSection handleFindStudents={handleFindStudents} />
      <CommunitySection handleFindStudents={handleFindStudents} />
    </div>
  );
};

export default Index;
