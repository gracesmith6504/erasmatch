
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { supabase } from "@/integrations/supabase/client";

const Onboarding = () => {
  const { isAuthenticated, currentUserProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [loadingRedirect, setLoadingRedirect] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      // If user is not authenticated, redirect to auth page
      if (!loading && !isAuthenticated) {
        navigate("/auth?mode=login");
        return;
      }
      
      // If user has already completed onboarding
      if (!loading && currentUserProfile?.onboarding_complete) {
        setLoadingRedirect(true);
        
        try {
          // Check how many users are in the same city
          const city = currentUserProfile?.city;
          if (city) {
            const { count, error } = await supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true })
              .eq('city', city)
              .neq('id', currentUserProfile?.id || '');
              
            if (error) throw error;
            
            // Redirect based on user count
            const redirectPath = (count && count > 2) ? "/groups" : "/students";
            navigate(redirectPath);
          } else {
            navigate("/students");
          }
        } catch (error) {
          console.error("Error during redirect check:", error);
          navigate("/students");
        } finally {
          setLoadingRedirect(false);
        }
      }
    };
    
    checkUserStatus();
  }, [isAuthenticated, currentUserProfile, loading, navigate]);

  if (loading || loadingRedirect) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <OnboardingFlow />;
};

export default Onboarding;
