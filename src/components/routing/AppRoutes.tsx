
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { ProfileProvider } from "@/components/profile/ProfileContext";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import ProfileView from "@/pages/ProfileView";
import PublicProfile from "@/pages/PublicProfile";
import Students from "@/pages/Students";
import Messages from "@/pages/Messages";
import Groups from "@/pages/Groups";
import NotFound from "@/pages/NotFound";
import Onboarding from "@/pages/Onboarding";
import PrivacyPolicy from "@/pages/PrivacyPolicy"; // Add import for Privacy Policy page

// Contexts
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";

const AppRoutes = () => {
  const { 
    isAuthenticated, 
    currentUserId, 
    handleLogin 
  } = useAuth();
  
  const { 
    profiles, 
    handleSendMessage,
    updateProfile,
    fetchProfile
  } = useData();

  // Find current user profile
  const currentUserProfile = profiles.find(p => p.id === currentUserId) || null;

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route 
        path="/auth" 
        element={
          isAuthenticated ? 
          <Navigate to="/onboarding" /> : 
          <Auth onLogin={handleLogin} />
        } 
      />
      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfileProvider 
              profile={currentUserProfile} 
              onProfileUpdate={updateProfile}
              fetchProfile={fetchProfile}
            >
              <Profile />
            </ProfileProvider>
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
        path="/u/:refCode" 
        element={<PublicProfile />} 
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
              messages={useData().messages}
              profiles={profiles}
              currentUserId={currentUserId!}
              onSendMessage={handleSendMessage}
            />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/groups" 
        element={
          <ProtectedRoute>
            <ProfileProvider 
              profile={currentUserProfile} 
              onProfileUpdate={updateProfile}
              fetchProfile={fetchProfile}
            >
              <Groups />
            </ProfileProvider>
          </ProtectedRoute>
        } 
      />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
