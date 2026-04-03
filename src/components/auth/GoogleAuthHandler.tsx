import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { generateUniqueRefCode } from "@/utils/refCodeGenerator";

export const GoogleAuthHandler = () => {
  const { currentUserProfile, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated && currentUserProfile) {
      const isNewGoogleUser = !currentUserProfile.onboarding_complete;
      
      if (isNewGoogleUser) {
        const setupNewUser = async () => {
          const updates: Record<string, any> = {};

          if (!currentUserProfile.privacy_consent_at) {
            updates.privacy_consent_at = new Date().toISOString();
          }

          if (!currentUserProfile.ref_code) {
            updates.ref_code = await generateUniqueRefCode(currentUserProfile.name || '');
          }

          const pendingRef = sessionStorage.getItem("pendingRefCode");
          if (pendingRef) {
            updates.invited_by = pendingRef;
            sessionStorage.removeItem("pendingRefCode");
          }

          if (Object.keys(updates).length > 0) {
            await supabase
              .from('profiles')
              .update(updates)
              .eq('id', currentUserProfile.id);
          }
          // AuthProvider handles navigation to /onboarding
        };
        setupNewUser();
      }
      // AuthProvider handles navigation for returning users
    }
  }, [isAuthenticated, currentUserProfile]);

  return null;
};
