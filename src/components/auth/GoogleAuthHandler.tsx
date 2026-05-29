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

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border-4 border-erasmatch-green border-t-transparent animate-spin" />
        <p className="mt-4 text-sm text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
};
