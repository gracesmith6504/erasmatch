import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { generateUniqueRefCode } from "@/utils/refCodeGenerator";

export const GoogleAuthHandler = () => {
  const { currentUserProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    if (isAuthenticated && currentUserProfile) {
      const isNewGoogleUser = !currentUserProfile.onboarding_complete;
      
      if (isNewGoogleUser && !currentUserProfile.privacy_consent_at) {
        // Auto-set privacy consent for Google OAuth users
        const setConsent = async () => {
          const refCode = currentUserProfile.ref_code || await generateUniqueRefCode('');
          await supabase
            .from('profiles')
            .update({
              privacy_consent_at: new Date().toISOString(),
              ref_code: refCode,
            })
            .eq('id', currentUserProfile.id);
          
          navigate("/onboarding");
        };
        setConsent();
      } else if (isNewGoogleUser) {
        navigate("/onboarding");
      } else {
        const returnTo = searchParams.get("returnTo");
        navigate(returnTo || "/students");
      }
    }
  }, [isAuthenticated, currentUserProfile, navigate, searchParams]);

  return null;
};
