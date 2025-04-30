
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

const Onboarding = () => {
  const { isAuthenticated, currentUserProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated, redirect to auth page
    if (!loading && !isAuthenticated) {
      navigate("/auth?mode=login");
    }
    
    // If user has already completed onboarding, redirect to students page
    if (!loading && currentUserProfile?.onboarding_complete) {
      navigate("/students");
    }
  }, [isAuthenticated, currentUserProfile, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <OnboardingFlow />;
};

export default Onboarding;
