import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
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

      let profileData: Profile | null = null;
      try {
        profileData = await fetchUserProfile(session.user.id);
      } catch (fetchError) {
        console.error('Failed to fetch profile (will retry on next auth event):', fetchError);
        return;
      }

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

        window.posthog?.identify(profileData.id, {
          email: session.user.email,
          name: profileData.name,
          city: profileData.city,
          university: profileData.university,
          semester: profileData.semester,
          has_avatar: !!profileData.avatar_url,
          home_university: profileData.home_university,
        });

        if (!profileData.onboarding_complete) {
          if (!window.location.pathname.includes('/onboarding') && !window.location.pathname.includes('/auth')) {
            navigate("/onboarding", { replace: true });
          }
        }
      } else {
        const userData = session.user.user_metadata || {};
        const defaultName = userData.name || userData.full_name || null;

        const pendingRef = sessionStorage.getItem("pendingRefCode");
        if (pendingRef) sessionStorage.removeItem("pendingRefCode");

        try {
          const newProfile = await createUserProfile(
            session.user.id,
            session.user.email,
            defaultName,
            { invitedBy: pendingRef }
          );

          if (newProfile) {
            setCurrentUserProfile(newProfile);

            if (!window.location.pathname.includes('/onboarding') && !window.location.pathname.includes('/auth')) {
              navigate("/onboarding", { replace: true });
            }
          } else {
            // createUserProfile returned null — insert failed silently.
            // Retry once after a short delay; if it still fails, show a
            // toast so the user knows something went wrong.
            console.warn('Profile creation returned null — retrying in 1s');
            await new Promise((r) => setTimeout(r, 1000));
            try {
              const retry = await createUserProfile(
                session.user.id,
                session.user.email!,
                defaultName,
                { invitedBy: pendingRef }
              );
              if (retry) {
                setCurrentUserProfile(retry);
                if (!window.location.pathname.includes('/onboarding') && !window.location.pathname.includes('/auth')) {
                  navigate("/onboarding", { replace: true });
                }
              } else {
                toast.error("Something went wrong setting up your profile. Please try signing out and back in.");
              }
            } catch (retryErr: any) {
              if (retryErr?.code === '23505') {
                const existing = await fetchUserProfile(session.user.id);
                if (existing) setCurrentUserProfile(existing);
              } else {
                toast.error("Something went wrong setting up your profile. Please try signing out and back in.");
              }
            }
          }
        } catch (createError: any) {
          if (createError?.code === '23505') {
            console.warn('Profile exists despite fetch returning null — retrying fetch');
            try {
              const existing = await fetchUserProfile(session.user.id);
              if (existing) setCurrentUserProfile(existing);
            } catch (retryError) {
              console.error('Retry fetch also failed:', retryError);
            }
          } else {
            console.error('Error creating profile:', createError);
            toast.error("Something went wrong setting up your profile. Please try signing out and back in.");
          }
        }
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
        await handleAuthChange(session);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
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

  const handleLogin = useCallback((email: string) => {
    setCurrentUserEmail(email);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      window.posthog?.reset();
      navigate("/auth?mode=login");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to log out. Please try again.");
    }
  }, [navigate]);

  const handleProfileUpdate = useCallback(async (updatedProfile: Partial<Profile>) => {
    if (!currentUserId) return Promise.resolve();

    try {
      const success = await updateUserProfile(currentUserId, updatedProfile);

      if (!success) {
        throw new Error('Failed to save profile changes');
      }

      const freshProfile = await fetchUserProfile(currentUserId);
      if (freshProfile) {
        setCurrentUserProfile(freshProfile);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return Promise.reject(error);
    }
  }, [currentUserId]);

  /** Re-fetches the current user's profile from the database. */
  const refreshProfile = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const freshProfile = await fetchUserProfile(currentUserId);
      if (freshProfile) {
        setCurrentUserProfile(freshProfile);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [currentUserId]);

  const value = useMemo(() => ({
    isAuthenticated,
    currentUserId,
    currentUserEmail,
    currentUserProfile,
    loading,
    handleLogin,
    handleLogout,
    handleProfileUpdate,
    refreshProfile,
  }), [isAuthenticated, currentUserId, currentUserEmail, currentUserProfile, loading, handleLogin, handleLogout, handleProfileUpdate, refreshProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
