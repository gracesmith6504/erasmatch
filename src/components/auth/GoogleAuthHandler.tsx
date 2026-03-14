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

          // Send welcome email
          const userEmail = currentUserProfile.email;
          const firstName = currentUserProfile.name?.split(' ')[0] || userEmail?.split('@')[0] || 'there';
          if (userEmail) {
            supabase.functions.invoke('send-welcome-email', {
              body: { email: userEmail, firstName },
            }).catch((err) => console.error('Welcome email error:', err));
          }
          
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
