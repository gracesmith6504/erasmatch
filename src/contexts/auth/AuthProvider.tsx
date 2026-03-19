
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";
import { AuthContext } from "./AuthContext";
import { fetchUserProfile, createUserProfile, updateUserProfile } from "./authUtils";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize and listen for auth changes
  useEffect(() => {
    // Fetch current session
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

    // Set up auth listener
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
  }, []);

  // Function to handle auth state changes
  const handleAuthChange = async (session: any) => {
    if (window.location.pathname === '/reset-password') return;
    if (session?.user) {
      setIsAuthenticated(true);
      setCurrentUserId(session.user.id);
      // Store user ID in localStorage for forum functionality
      localStorage.setItem('userId', session.user.id);
      setCurrentUserEmail(session.user.email);

      // Fetch user profile
      try {
        const profileData = await fetchUserProfile(session.user.id);

        if (profileData) {
          // Check if the user account is marked as deleted
          if (profileData.deleted_at) {
            console.log("User has a deleted account, handling re-registration");
            
            // This is a re-registration after deletion
            // Reset the deleted_at timestamp and restore basic info
            const userData = session.user.user_metadata || {};
            const defaultName = userData.name || userData.full_name || null;
            
            const { error: restoreError } = await supabase
              .from('profiles')
              .update({
                deleted_at: null,
                email: session.user.email,
                name: defaultName,
                onboarding_complete: false,
                privacy_consent_at: new Date().toISOString()
              })
              .eq('id', session.user.id);

            if (restoreError) {
              console.error("Error restoring profile:", restoreError);
              toast.error("Error restoring your account. Please try again.");
              await supabase.auth.signOut();
              return;
            }

            // Fetch the updated profile
            const updatedProfile = await fetchUserProfile(session.user.id);
            if (updatedProfile) {
              setCurrentUserProfile(updatedProfile);
              toast.success("Welcome back! Please complete your profile setup.");
              
              // Redirect to onboarding for profile completion
              if (!window.location.pathname.includes('/onboarding') && !window.location.pathname.includes('/auth')) {
                navigate("/onboarding");
              }
            }
            return;
          }
          
          setCurrentUserProfile(profileData);
          
          // Check if this is a new user who needs onboarding
          if (!profileData.onboarding_complete) {
            // Check if we're not already on the onboarding or auth page
            if (!window.location.pathname.includes('/onboarding') && !window.location.pathname.includes('/auth')) {
              navigate("/onboarding");
            }
          }
        } else {
          // No profile found - this is a completely new user
          console.log("No profile found, creating new profile for user:", session.user.id);
          
          const userData = session.user.user_metadata || {};
          const defaultName = userData.name || userData.full_name || null;
          
          // Check for pending referral code from signup flow
          const pendingRef = sessionStorage.getItem("pendingRefCode");
          if (pendingRef) sessionStorage.removeItem("pendingRefCode");
          
          // Create a new profile for this new user (includes ref_code and privacy_consent)
          const newProfile = await createUserProfile(
            session.user.id, 
            session.user.email, 
            defaultName,
            { invitedBy: pendingRef }
          );
          
          if (newProfile) {
            setCurrentUserProfile(newProfile);
            
            // New user, redirect to onboarding
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
      // Remove user ID from localStorage
      localStorage.removeItem('userId');
      setCurrentUserEmail(null);
      setCurrentUserProfile(null);
    }
  };

  const handleLogin = (email: string) => {
    // The actual login happens in the Auth component
    // This is just for additional state management if needed
    setCurrentUserEmail(email);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Show success toast
      toast.success("You've been logged out");
      
      // Redirect to login page
      navigate("/auth?mode=login");
      
      // Auth listener will handle state changes but force a reload to ensure UI updates
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const handleProfileUpdate = async (updatedProfile: Partial<Profile>) => {
    if (!currentUserId) return Promise.resolve();

    try {
      const success = await updateUserProfile(currentUserId, updatedProfile);
      
      if (success && currentUserProfile) {
        // Update the local state with the updated profile
        setCurrentUserProfile({
          ...currentUserProfile,
          ...updatedProfile,
        });
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating profile:', error);
      return Promise.reject(error);
    }
  };

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
        handleProfileUpdate
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
