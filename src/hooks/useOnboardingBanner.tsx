
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useOnboardingBanner = (currentUserId: string | null) => {
  const [showBanner, setShowBanner] = useState(false);
  const [cityName, setCityName] = useState<string | null>(null);
  const [hasAvatar, setHasAvatar] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    // First check if banner has been dismissed via localStorage
    const isDismissed = localStorage.getItem("welcomeBannerDismissed");
    if (isDismissed === "true") {
      setShowBanner(false);
      return;
    }
    
    // Check if the user just completed onboarding
    const justCompletedOnboarding = sessionStorage.getItem("justCompletedOnboarding");

    if (justCompletedOnboarding === "true") {
      setShowBanner(true);
      const city = sessionStorage.getItem("userCity");
      setCityName(city);
    }
    
    // For manual testing, we can also check the query string
    const params = new URLSearchParams(location.search);
    if (params.get("from") === "onboarding") {
      setShowBanner(true);
      sessionStorage.setItem("justCompletedOnboarding", "true");
    }
    
    // If no city yet, fetch it from the user's profile and also check avatar
    if (currentUserId) {
      const fetchUserData = async () => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("city, avatar_url")
            .eq("id", currentUserId)
            .single();
          
          if (data && !error) {
            setCityName(data.city);
            setHasAvatar(!!data.avatar_url); // Set hasAvatar based on avatar_url existence
            
            if (data.city) {
              sessionStorage.setItem("userCity", data.city || "");
            }
            
            // Show banner if we just completed onboarding or coming from onboarding
            if (justCompletedOnboarding === "true" || params.get("from") === "onboarding") {
              setShowBanner(true);
            } else {
              // Only show banner if no avatar (and not dismissed)
              setShowBanner(!data.avatar_url);
            }
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      };
      
      fetchUserData();
    }
  }, [location.search, currentUserId]);
  
  return {
    showBanner,
    cityName,
    hasAvatar,
    setShowBanner
  };
};
