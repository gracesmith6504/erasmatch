
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { StudentStoriesSection } from "@/components/home/StudentStoriesSection";
import { GroupChatSection } from "@/components/home/GroupChatSection";
import { CommunitySection } from "@/components/home/CommunitySection";
import { HomeFooter } from "@/components/home/HomeFooter";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  // Redirecting to students page instead of accommodation
  const handlePlanning = () => {
    if (isAuthenticated) {
      navigate("/students"); // Changed from "/accommodation" to "/students"
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
      <HomeFooter />
    </div>
  );
};

export default Index;
