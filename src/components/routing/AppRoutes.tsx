/**
 * Application route definitions.
 * Public routes: home, auth, about, privacy, students, public profiles.
 * Protected routes: onboarding, profile, messages, groups.
 *
 * All routes except the landing page are lazy-loaded so the initial bundle
 * only ships the code needed for "/". Each non-landing route is fetched as
 * a separate chunk on first navigation.
 */
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { ProfileProvider } from "@/components/profile/ProfileContext";

// Landing page stays eager — it's the most common first paint.
import Index from "@/pages/Index";

// Lazy-loaded route chunks.
const Auth = lazy(() => import("@/pages/Auth"));
const Profile = lazy(() => import("@/pages/Profile"));
const ProfileView = lazy(() => import("@/pages/ProfileView"));
const PublicProfile = lazy(() => import("@/pages/PublicProfile"));
const Students = lazy(() => import("@/pages/Students"));
const Messages = lazy(() => import("@/pages/Messages"));
const Groups = lazy(() => import("@/pages/Groups"));
const About = lazy(() => import("@/pages/About"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const AdminUniversities = lazy(() => import("@/pages/AdminUniversities"));
const CityLanding = lazy(() => import("@/pages/CityLanding"));

import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";

const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="w-10 h-10 rounded-full border-4 border-erasmatch-green border-t-transparent animate-spin" />
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated, currentUserId, currentUserProfile, handleLogin } = useAuth();
  const { updateProfile, fetchProfile } = useData();

  return (
    <Suspense fallback={<RouteFallback />}>
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
          element={<Students currentUserId={currentUserId} />} 
        />
        <Route 
          path="/profile/:id" 
          element={
            <ProfileView 
              currentUserId={currentUserId}
            />
          } 
        />
        <Route path="/u/:refCode" element={<PublicProfile />} />
        <Route path="/erasmus/:citySlug" element={<CityLanding />} />

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
                currentUserId={currentUserId!}
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
    </Suspense>
  );
};

export default AppRoutes;
