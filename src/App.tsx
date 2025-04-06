
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";

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

// Sample data for demo purposes
const sampleProfiles: ProfileType[] = [
  {
    id: "1",
    name: "Maria Garcia",
    email: "maria@example.com",
    university: "Universidad de Barcelona",
    city: "Barcelona",
    semester: "Fall 2024",
    bio: "Psychology student from Italy. Love photography and exploring new places!",
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Thomas Müller",
    email: "thomas@example.com",
    university: "Technical University of Munich",
    city: "Munich",
    semester: "Spring 2025",
    bio: "Engineering student from France. Big fan of football and outdoor activities.",
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Sophie Johnson",
    email: "sophie@example.com",
    university: "University of Amsterdam",
    city: "Amsterdam",
    semester: "Fall 2024",
    bio: "Business student from Sweden. Interested in startups and innovation.",
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
];

const sampleMessages: Message[] = [
  {
    id: "1",
    sender_id: "1",
    receiver_id: "current-user",
    content: "Hi there! Are you also going to Barcelona next semester?",
    created_at: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
  },
  {
    id: "2",
    sender_id: "current-user",
    receiver_id: "1",
    content: "Yes I am! Just got my acceptance letter last week. So excited!",
    created_at: new Date(Date.now() - 540000).toISOString(), // 9 minutes ago
  },
  {
    id: "3",
    sender_id: "1",
    receiver_id: "current-user",
    content: "That's awesome! Have you found accommodation yet?",
    created_at: new Date(Date.now() - 480000).toISOString(), // 8 minutes ago
  },
  {
    id: "4",
    sender_id: "current-user",
    receiver_id: "1",
    content: "Not yet, I'm still looking. Do you have any recommendations?",
    created_at: new Date(Date.now() - 420000).toISOString(), // 7 minutes ago
  },
  {
    id: "5",
    sender_id: "2",
    receiver_id: "current-user",
    content: "Hey! I saw you're going to Munich. I'm studying there too!",
    created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
  },
];

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<ProfileType[]>(sampleProfiles);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);

  // For demo, create profile for currently logged-in user
  const [currentUserProfile, setCurrentUserProfile] = useState<ProfileType | null>(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");

    if (userId && userEmail) {
      setIsAuthenticated(true);
      setCurrentUserId(userId);
      setCurrentUserEmail(userEmail);

      // Load or create user profile
      const existingProfile = profiles.find(p => p.id === userId);
      if (existingProfile) {
        setCurrentUserProfile(existingProfile);
      } else {
        // Create a new profile for the user
        const newProfile: ProfileType = {
          id: userId,
          name: null,
          email: userEmail,
          university: null,
          city: null,
          semester: null,
          bio: null,
          avatar_url: null,
          created_at: new Date().toISOString(),
        };
        setCurrentUserProfile(newProfile);
        setProfiles(prev => [...prev, newProfile]);
      }
    }
  }, []);

  const handleLogin = (email: string) => {
    // For demo purposes, create a user ID
    const userId = "current-user"; // In a real app, this would be the Supabase auth.user.id
    
    setIsAuthenticated(true);
    setCurrentUserId(userId);
    setCurrentUserEmail(email);
    
    // Store in local storage
    localStorage.setItem("userId", userId);
    localStorage.setItem("userEmail", email);
    
    // Create a profile if it doesn't exist
    const existingProfile = profiles.find(p => p.id === userId);
    if (!existingProfile) {
      const newProfile: ProfileType = {
        id: userId,
        name: null,
        email: email,
        university: null,
        city: null,
        semester: null,
        bio: null,
        avatar_url: null,
        created_at: new Date().toISOString(),
      };
      setCurrentUserProfile(newProfile);
      setProfiles(prev => [...prev, newProfile]);
    } else {
      setCurrentUserProfile(existingProfile);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserId(null);
    setCurrentUserEmail(null);
    setCurrentUserProfile(null);
    
    // Clear local storage
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
  };

  const handleProfileUpdate = (updatedProfile: Partial<ProfileType>) => {
    if (!currentUserId) return;

    // Update the current user's profile
    const updated = {
      ...currentUserProfile!,
      ...updatedProfile,
    };

    // Update profiles list
    setProfiles(prev =>
      prev.map(profile => 
        profile.id === currentUserId ? updated : profile
      )
    );

    // Update current profile
    setCurrentUserProfile(updated as ProfileType);
  };

  const handleSendMessage = (receiverId: string, content: string) => {
    if (!currentUserId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender_id: currentUserId,
      receiver_id: receiverId,
      content,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  // Protected route component
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth?mode=login" />;
    }
    return children;
  };

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
