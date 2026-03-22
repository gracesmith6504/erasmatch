/**
 * Application route definitions.
 * Public routes: home, auth, about, privacy, students, public profiles.
 * Protected routes: onboarding, profile, messages, groups.
 */
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
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";
import Onboarding from "@/pages/Onboarding";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ResetPassword from "@/pages/ResetPassword";
import AdminUniversities from "@/pages/AdminUniversities";

import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";

const AppRoutes = () => {
  const { isAuthenticated, currentUserId, currentUserProfile, handleLogin } = useAuth();
  const { profiles, messages, handleSendMessage, updateProfile, fetchProfile } = useData();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route 
        path="/auth" 
        element={
          isAuthenticated ? 
          <Navigate to={currentUserProfile?.onboarding_complete ? "/students" : "/onboarding"} /> : 
          <Auth onLogin={handleLogin} />
        } 
      />
      <Route path="/about" element={<About />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route 
        path="/students" 
        element={<Students profiles={profiles} currentUserId={currentUserId} />} 
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
      <Route path="/u/:refCode" element={<PublicProfile />} />

      {/* Protected routes — require authentication */}
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
      <Route 
        path="/admin/universities" 
        element={
          <ProtectedRoute>
            <AdminUniversities />
          </ProtectedRoute>
        } 
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
