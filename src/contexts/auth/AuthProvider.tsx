
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
        handleAuthChange(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to handle auth state changes
  const handleAuthChange = async (session: any) => {
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
          // Check if the user account is deleted
          if (profileData.deleted_at) {
            // If account is deleted, sign out
            await supabase.auth.signOut();
            setIsAuthenticated(false);
            setCurrentUserId(null);
            localStorage.removeItem('userId');
            setCurrentUserEmail(null);
            setCurrentUserProfile(null);
            toast.error("This account has been deleted");
            navigate("/auth?mode=login");
            return;
          }
          
          setCurrentUserProfile(profileData);
        } else {
          // No profile found, create a new one with user metadata if available
          const userData = session.user.user_metadata || {};
          const defaultName = userData.name || userData.full_name || null;
          
          const newProfile = await createUserProfile(
            session.user.id, 
            session.user.email, 
            defaultName
          );
          
          if (newProfile) {
            setCurrentUserProfile(newProfile);
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
