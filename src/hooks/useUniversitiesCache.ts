
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { University } from "@/components/university/types";

// In-memory cache
let universitiesCache: University[] | null = null;
let lastFetchTime = 0;
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes

export function clearUniversitiesCache() {
  universitiesCache = null;
  lastFetchTime = 0;
}

export function useUniversitiesCache() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        
        // Check if we have a valid cache
        const now = Date.now();
        if (universitiesCache && now - lastFetchTime < CACHE_EXPIRY) {
          console.log("Using cached universities data");
          setUniversities(universitiesCache);
          setLoading(false);
          return;
        }
        
        // If no valid cache, fetch from Supabase
        console.log("Fetching fresh universities data");
        const { data, error } = await supabase
          .from('universities')
          .select('id, name, city, country')
          .order('name');

        if (error) {
          throw error;
        }

        if (data) {
          const formattedData = data.map(uni => ({
            id: uni.id,
            name: uni.name || "",
            city: uni.city || null,
            country: uni.country || null,
          })) as University[];
          
          // Update the cache
          universitiesCache = formattedData;
          lastFetchTime = now;
          
          setUniversities(formattedData);
        }
      } catch (err: any) {
        console.error("Error fetching universities:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  return {
    universities,
    loading,
    error,
    clearCache: () => {
      universitiesCache = null;
      lastFetchTime = 0;
    }
  };
}
