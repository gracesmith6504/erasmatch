import { ReactNode, useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";
import { AuthContext } from "./AuthContext";
import { fetchUserProfile, createUserProfile, updateUserProfile } from "./authUtils";
// Use window.posthog (initialised via HTML snippet) for reliable production tracking
declare global {
  interface Window {
    posthog?: {
      identify: (id: string, properties?: Record<string, any>) => void;
      reset: () => void;
      capture: (event: string, properties?: Record<string, any>) => void;
    };
  }
}

type AuthProviderProps = {
  children: ReactNode;
};

const clearLocalAuthStorage = () => {
  localStorage.removeItem("userId");
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
      localStorage.removeItem(key);
    }
  });
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to handle auth state changes — memoised with navigate dependency
  const handleAuthChange = useCallback(async (session: Session | null) => {
    if (window.location.pathname === '/reset-password') return;
    if (session?.user) {
      setIsAuthenticated(true);
      setCurrentUserId(session.user.id);
      localStorage.setItem('userId', session.user.id);
      setCurrentUserEmail(session.user.email);

      try {
        const profileData = await fetchUserProfile(session.user.id);

        if (profileData) {
          if (profileData.deleted_at) {
            sessionStorage.removeItem("accountDeletionInProgress");
            await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
            clearLocalAuthStorage();
            setIsAuthenticated(false);
            setCurrentUserId(null);
            setCurrentUserEmail(null);
            setCurrentUserProfile(null);

            if (!window.location.pathname.includes('/auth')) {
              navigate("/auth?mode=signup", { replace: true });
            }
            return;
          }

          setCurrentUserProfile(profileData);

          posthog.identify(profileData.id, {
            email: profileData.email,
            name: profileData.name,
            city: profileData.city,
            university: profileData.university,
            semester: profileData.semester,
            has_avatar: !!profileData.avatar_url,
            home_university: profileData.home_university,
          });
          
          if (!profileData.onboarding_complete) {
            if (!window.location.pathname.includes('/onboarding') && !window.location.pathname.includes('/auth')) {
              navigate("/onboarding");
            }
          }
        } else {
          console.log("No profile found, creating new profile for user:", session.user.id);
          
          const userData = session.user.user_metadata || {};
          const defaultName = userData.name || userData.full_name || null;
          
          const pendingRef = sessionStorage.getItem("pendingRefCode");
          if (pendingRef) sessionStorage.removeItem("pendingRefCode");
          
          const newProfile = await createUserProfile(
            session.user.id, 
            session.user.email, 
            defaultName,
            { invitedBy: pendingRef }
          );
          
          if (newProfile) {
            setCurrentUserProfile(newProfile);
            
            if (!window.location.pathname.includes('/onboarding') && !window.location.pathname.includes('/auth')) {
              navigate("/onboarding");
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      setIsAuthenticated(false);
      setCurrentUserId(null);
      clearLocalAuthStorage();
      setCurrentUserEmail(null);
      setCurrentUserProfile(null);
    }
  }, [navigate]);

  // Initialize and listen for auth changes
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        handleAuthChange(session);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        if (event === "PASSWORD_RECOVERY") {
          navigate("/reset-password");
          return;
        }
        handleAuthChange(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, handleAuthChange]);

  const handleLogin = (email: string) => {
    setCurrentUserEmail(email);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      posthog.reset();
      toast.success("You've been logged out");
      navigate("/auth?mode=login");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const handleProfileUpdate = async (updatedProfile: Partial<Profile>) => {
    if (!currentUserId) return Promise.resolve();

    try {
      const success = await updateUserProfile(currentUserId, updatedProfile);
      
      if (success) {
        const freshProfile = await fetchUserProfile(currentUserId);
        if (freshProfile) {
          setCurrentUserProfile(freshProfile);
        }
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating profile:', error);
      return Promise.reject(error);
    }
  };

  /** Re-fetches the current user's profile from the database. */
  const refreshProfile = useCallback(async () => {
    if (!currentUserId) return;
    const freshProfile = await fetchUserProfile(currentUserId);
    if (freshProfile) {
      setCurrentUserProfile(freshProfile);
    }
  }, [currentUserId]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUserId,
        currentUserEmail,
        currentUserProfile,
        loading,
        handleLogin,
        handleLogout,
        handleProfileUpdate,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
