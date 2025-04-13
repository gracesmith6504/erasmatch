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
        handleAuthChange(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthChange = async (session: any) => {
    if (session?.user) {
      setIsAuthenticated(true);
      setCurrentUserId(session.user.id);
      localStorage.setItem('userId', session.user.id);
      setCurrentUserEmail(session.user.email);

      try {
        console.log("Fetching profile for user:", session.user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile data:', error);
          throw error;
        }

        if (data) {
          console.log("Profile data loaded:", data);
          const profileData = data as unknown as Profile;
          setCurrentUserProfile(profileData);
        } else {
          console.warn("No profile data returned for user");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      setIsAuthenticated(false);
      setCurrentUserId(null);
      localStorage.removeItem('userId');
      setCurrentUserEmail(null);
      setCurrentUserProfile(null);
    }
  };

  const handleLogin = (email: string) => {
    setCurrentUserEmail(email);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileUpdate = async (updatedProfile: Partial<Profile>) => {
    if (!currentUserId) return;

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
