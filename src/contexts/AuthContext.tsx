
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
        await handleAuthChange(session);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await handleAuthChange(session);
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
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          // Type cast to ensure all required fields are present
          const profileData = data as unknown as Profile;
          setCurrentUserProfile(profileData);
        } else {
          // No profile found, create a new one with user metadata if available
          const userData = session.user.user_metadata || {};
          const defaultName = userData.name || userData.full_name || null;
          
          const newProfile = {
            id: session.user.id,
            name: defaultName,
            email: session.user.email,
            university: null,
            city: null,
            semester: null,
            bio: null,
            avatar_url: null,
            created_at: new Date().toISOString(),
            home_university: null,
            personality_tags: [],
            course: null,
          };
          
          const { error: createError } = await supabase
            .from('profiles')
            .upsert(newProfile);
            
          if (createError) {
            console.error("Error creating profile:", createError);
          } else {
            setCurrentUserProfile(newProfile as Profile);
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
      // Auth listener will handle the state changes
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileUpdate = async (updatedProfile: Partial<Profile>) => {
    if (!currentUserId) return Promise.reject("No authenticated user");

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', currentUserId);
      
      if (error) throw error;
      
      // Update the local state with the updated profile
      if (currentUserProfile) {
        const updated = {
          ...currentUserProfile,
          ...updatedProfile,
        };
        setCurrentUserProfile(updated);
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
