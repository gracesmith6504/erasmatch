import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const GoogleAuthHandler = () => {
  const { currentUserProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    if (isAuthenticated && currentUserProfile) {
      // Check if user just completed Google OAuth signup
      const isNewGoogleUser = !currentUserProfile.onboarding_complete;
      
      if (isNewGoogleUser) {
        // Redirect to onboarding for new Google users
        navigate("/onboarding");
      } else {
        // Existing user, redirect to main app
        const returnTo = searchParams.get("returnTo");
        navigate(returnTo || "/students");
      }
    }
  }, [isAuthenticated, currentUserProfile, navigate, searchParams]);

  return null;
};
