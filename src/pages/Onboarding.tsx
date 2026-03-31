import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

const Onboarding = () => {
  const { isAuthenticated, currentUserProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [loadingRedirect, setLoadingRedirect] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
    
    // Only redirect if not authenticated. Don't redirect when onboarding_complete
    // because OnboardingFlow manages the celebration/city payoff sequence
    // before navigating to /students?from=onboarding itself.
    if (!loading && !isAuthenticated) {
      navigate("/auth?mode=login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || loadingRedirect) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-erasmatch-green border-t-transparent animate-spin"></div>
          <p className="mt-4 text-erasmatch-green font-medium">Loading...</p>
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