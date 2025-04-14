
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import ProfileView from "@/pages/ProfileView";
import Students from "@/pages/Students";
import Locations from "@/pages/Universities";
import UniversityHub from "@/pages/UniversityHub";
import Messages from "@/pages/Messages";
import Groups from "@/pages/Groups";
import GroupChatView from "@/components/groups/GroupChatView";
import NotFound from "@/pages/NotFound";
import ForumCities from "@/pages/ForumCities";
import CityForum from "@/pages/CityForum";
import ForumPostDetail from "@/pages/ForumPostDetail";
import NewForumPost from "@/pages/NewForumPost";
import Accommodation from "@/pages/Accommodation";

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
    handleSendMessage 
  } = useData();

  return (
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
            <Profile />
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
        path="/universities" 
        element={<Locations />} 
      />
      <Route 
        path="/university-hub/:id" 
        element={<UniversityHub />} 
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
            <Groups />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/groups/university/:id" 
        element={
          <ProtectedRoute>
            <GroupChatView chatType="university" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/groups/city/:id" 
        element={
          <ProtectedRoute>
            <GroupChatView chatType="city" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/accommodation" 
        element={<Accommodation />} 
      />
      {/* Forum Routes */}
      <Route path="/forum" element={<ForumCities />} />
      <Route path="/forum/:city" element={<CityForum />} />
      <Route 
        path="/forum/:city/new" 
        element={
          <ProtectedRoute>
            <NewForumPost />
          </ProtectedRoute>
        } 
      />
      <Route path="/forum/post/:postId" element={<ForumPostDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
