
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

    if (justCompletedOnboarding) {
      setShowBanner(true);
      const city = sessionStorage.getItem("userCity");
      setCityName(city);
    }
    
    // For manual testing, we can also check the query string
    const params = new URLSearchParams(location.search);
    if (params.get("from") === "onboarding" || params.get("showBanner") === "true") {
      setShowBanner(true);
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
            sessionStorage.setItem("userCity", data.city || "");
            setShowBanner(true); // Only show banner if we have a city and no avatar
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
