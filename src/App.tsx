
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ProfileView from "./pages/ProfileView";
import Students from "./pages/Students";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";

// Types
import { Profile as ProfileType, Message } from "@/types";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // For currently logged-in user profile
  const [currentUserProfile, setCurrentUserProfile] = useState<ProfileType | null>(null);

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

  // Function to fetch messages for the current user
  const fetchUserMessages = async (userId: string) => {
    try {
      const { data: userMessages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (userMessages) {
        setMessages(userMessages as Message[]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Function to fetch all profiles
  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        setProfiles(data as ProfileType[]);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  // Function to handle auth state changes
  const handleAuthChange = async (session: any) => {
    if (session?.user) {
      setIsAuthenticated(true);
      setCurrentUserId(session.user.id);
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
          setCurrentUserProfile(data as ProfileType);
        }

        // Fetch all profiles and messages
        await Promise.all([
          fetchProfiles(),
          fetchUserMessages(session.user.id)
        ]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      setIsAuthenticated(false);
      setCurrentUserId(null);
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

  const handleProfileUpdate = async (updatedProfile: Partial<ProfileType>) => {
    if (!currentUserId) return;

    // The actual profile update happens in the Profile component
    // This is just to update the local state
    if (currentUserProfile) {
      const updated = {
        ...currentUserProfile,
        ...updatedProfile,
      };
      setCurrentUserProfile(updated);

      // Update profiles list
      setProfiles(prev =>
        prev.map(profile => 
          profile.id === currentUserId ? updated : profile
        )
      );
    }

    // Refresh profiles
    await fetchProfiles();
  };

  const handleSendMessage = async (receiverId: string, content: string) => {
    if (!currentUserId) return;

    try {
      // Send message via Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          receiver_id: receiverId,
          content
        })
        .select()
        .single();
      
      if (error) throw error;

      if (data) {
        // Update local messages state
        setMessages(prev => [data as Message, ...prev]);
        return data;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Protected route component
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/auth?mode=login" />;
    }
    
    return children;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/auth" 
                element={
                  isAuthenticated ? 
                  <Navigate to="/" /> : 
                  <Auth onLogin={handleLogin} />
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile 
                      profile={currentUserProfile} 
                      onProfileUpdate={handleProfileUpdate}
                    />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/:id" 
                element={
                  <ProfileView 
                    profiles={profiles}
                    currentUserId={currentUserId}
                    onSendMessage={handleSendMessage}
                  />
                } 
              />
              <Route 
                path="/students" 
                element={
                  <Students 
                    profiles={profiles}
                    currentUserId={currentUserId}
                  />
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute>
                    <Messages 
                      messages={messages}
                      profiles={profiles}
                      currentUserId={currentUserId!}
                      onSendMessage={handleSendMessage}
                    />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
