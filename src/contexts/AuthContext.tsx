
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";

type AuthContextType = {
  isAuthenticated: boolean;
  currentUserId: string | null;
  currentUserEmail: string | null;
  currentUserProfile: Profile | null;
  loading: boolean;
  handleLogin: (email: string) => void;
  handleLogout: () => Promise<void>;
  handleProfileUpdate: (updatedProfile: Partial<Profile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          // Type cast to ensure all required fields are present
          const profileData = data as unknown as Profile;
          setCurrentUserProfile(profileData);
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
      // Auth listener will handle the state changes
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileUpdate = async (updatedProfile: Partial<Profile>) => {
    if (!currentUserId) return;

    // The actual profile update happens in the Profile component
    // This is just to update the local state
    if (currentUserProfile) {
      const updated = {
        ...currentUserProfile,
        ...updatedProfile,
      };
      setCurrentUserProfile(updated);
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
