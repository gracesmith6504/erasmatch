import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { supabase } from "@/integrations/supabase/client";

const Onboarding = () => {
  const { isAuthenticated, currentUserProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [loadingRedirect, setLoadingRedirect] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    // Mark page as loaded for animations
    setPageLoaded(true);
    
    const checkUserStatus = async () => {
      // If user is not authenticated, redirect to auth page
      if (!loading && !isAuthenticated) {
        navigate("/auth?mode=login");
        return;
      }
      
      // If user has already completed onboarding
      if (!loading && currentUserProfile?.onboarding_complete) {
        setLoadingRedirect(true);
        
        // Redirect to students page for completed onboarding
        navigate("/students");
        
        setLoadingRedirect(false);
      }
    };
    
    checkUserStatus();
  }, [isAuthenticated, currentUserProfile, loading, navigate]);

  if (loading || loadingRedirect) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50/60 to-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-erasmatch-blue border-t-transparent animate-spin"></div>
          <p className="mt-4 text-erasmatch-blue font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <OnboardingFlow />
    </div>
  );
};

export default Onboarding;
