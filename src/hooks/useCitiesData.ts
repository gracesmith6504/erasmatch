
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCitiesData() {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        
        // Fetch all cities from universities table
        const { data: citiesData, error: citiesError } = await supabase
          .from('universities')
          .select('city')
          .not('city', 'is', null);

        if (citiesError) {
          throw citiesError;
        }

        // Extract unique city names and sort alphabetically
        const uniqueCities = Array.from(
          new Set(
            citiesData
              .map(item => item.city)
              .filter(Boolean)
              .sort((a, b) => a.localeCompare(b))
          )
        );
        
        setCities(uniqueCities);
      } catch (err: any) {
        console.error("Error fetching cities:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return {
    cities,
    loading,
    error
  };
}
