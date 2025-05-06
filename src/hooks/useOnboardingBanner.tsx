
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
    const fromParam = new URLSearchParams(location.search).get("from");

    // Always prioritize showing banner if coming directly from onboarding
    if (fromParam === "onboarding" || justCompletedOnboarding === "true") {
      setShowBanner(true);
      const city = sessionStorage.getItem("userCity");
      setCityName(city);
      
      // Store the onboarding completion flag if it came from URL
      if (fromParam === "onboarding") {
        sessionStorage.setItem("justCompletedOnboarding", "true");
      }
    }
    
    // If user is authenticated, fetch their profile data
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
            setHasAvatar(!!data.avatar_url);
            
            if (data.city) {
              sessionStorage.setItem("userCity", data.city || "");
            }
            
            // Determine whether to show banner based on onboarding status and avatar
            const shouldShowBanner = (fromParam === "onboarding" || 
                                     justCompletedOnboarding === "true" || 
                                     !data.avatar_url);
            
            if (shouldShowBanner && isDismissed !== "true") {
              setShowBanner(true);
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
