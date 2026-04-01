import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { AlumniAdviceSection } from "@/components/home/AlumniAdviceSection";
import { StudentStoriesSection } from "@/components/home/StudentStoriesSection";
import { GroupChatSection } from "@/components/home/GroupChatSection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { HomeFooter } from "@/components/home/HomeFooter";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref");

  useEffect(() => {
    document.title = "ErasMatch - Connect with Erasmus Students";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Connect with fellow Erasmus students before you arrive. Find study buddies, join group chats, and make friends for your exchange experience.');
    }
  }, []);

  const refParam = refCode ? `&ref=${refCode}` : "";

  const handleFindStudents = () => {
    navigate(isAuthenticated ? "/students" : `/auth?mode=signup${refParam}`);
  };

  const handleJoinChats = () => {
    navigate(isAuthenticated ? "/groups" : "/auth?mode=signup");
  };

  const handlePlanning = () => {
    navigate(isAuthenticated ? "/students" : "/auth?mode=signup");
  };

  return (
    <div className="min-h-screen">
      <HeroSection 
        handleFindStudents={handleFindStudents}
        handleJoinChats={handleJoinChats}
        handlePlanning={handlePlanning}
      />
      <FeaturesSection />
      <AlumniAdviceSection handleFindStudents={handleFindStudents} />
      <div className="h-8 sm:h-16 bg-gradient-to-b from-card to-background" />
      <HowItWorksSection />
      <StudentStoriesSection />
      <div className="h-8 sm:h-16 bg-gradient-to-b from-secondary/30 to-background" />
      <GroupChatSection handleFindStudents={handleFindStudents} />
      <CommunitySection handleFindStudents={handleFindStudents} />
      <HomeFooter />
    </div>
  );
};

export default Index;
