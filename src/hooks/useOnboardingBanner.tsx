
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useOnboardingBanner = (currentUserId: string | null) => {
  const [showBanner, setShowBanner] = useState(false);
  const [cityName, setCityName] = useState<string | null>(null);
  const location = useLocation();
  
  useEffect(() => {
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
    
    // If there's no city yet, fetch it from the user's profile
    if (!cityName && currentUserId) {
      const fetchUserCity = async () => {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("city")
            .eq("id", currentUserId)
            .single();
          
          if (data && !error) {
            setCityName(data.city);
            sessionStorage.setItem("userCity", data.city || "");
            setShowBanner(true); // Always show banner if we have a city
          }
        } catch (err) {
          console.error("Error fetching user city:", err);
        }
      };
      
      fetchUserCity();
    }
  }, [location.search, currentUserId, cityName]);
  
  return {
    showBanner,
    cityName,
    setShowBanner
  };
};
