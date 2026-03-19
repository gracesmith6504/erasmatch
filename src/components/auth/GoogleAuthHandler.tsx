import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { generateUniqueRefCode } from "@/utils/refCodeGenerator";

export const GoogleAuthHandler = () => {
  const { currentUserProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated && currentUserProfile) {
      const isNewGoogleUser = !currentUserProfile.onboarding_complete;
      
      if (isNewGoogleUser) {
        // Handle new Google user setup
        const setupNewUser = async () => {
          const updates: Record<string, any> = {};

          // Set privacy consent if missing
          if (!currentUserProfile.privacy_consent_at) {
            updates.privacy_consent_at = new Date().toISOString();
          }

          // Set ref_code if missing
          if (!currentUserProfile.ref_code) {
            updates.ref_code = await generateUniqueRefCode(currentUserProfile.name || '');
          }

          // Read referral from sessionStorage (stored before OAuth redirect)
          const pendingRef = sessionStorage.getItem("pendingRefCode");
          if (pendingRef) {
            updates.invited_by = pendingRef;
            sessionStorage.removeItem("pendingRefCode");
          }

          // Apply updates if any
          if (Object.keys(updates).length > 0) {
            await supabase
              .from('profiles')
              .update(updates)
              .eq('id', currentUserProfile.id);
          }

          navigate("/onboarding");
        };
        setupNewUser();
      } else {
        // Returning user — check for stored returnTo
        const returnTo = sessionStorage.getItem("pendingReturnTo");
        if (returnTo) {
          sessionStorage.removeItem("pendingReturnTo");
          navigate(returnTo);
        } else {
          navigate("/students");
        }
      }
    }
  }, [isAuthenticated, currentUserProfile, navigate]);

  return null;
};
