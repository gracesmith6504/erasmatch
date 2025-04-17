
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { University } from "./types";

export function useUniversitySearch() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Initial fetch when component mounts
    fetchUniversities();
  }, []);

  const fetchUniversities = async (query = "") => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('universities')
        .select('id, name, city, country');
      
      if (error) {
        console.error("Error fetching universities:", error);
        setUniversities([]);
        return;
      }
      
      if (data) {
        // Cast the data to University type after ensuring it has the correct structure
        const typedData = data.map(uni => ({
          id: uni.id,
          name: uni.name,
          city: uni.city,
          country: uni.country
        })) as University[];
        
        setUniversities(typedData);
      } else {
        setUniversities([]);
      }
    } catch (error) {
      console.error("Error in fetch operation:", error);
      setUniversities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    const fetchWithQuery = async () => {
      try {
        setIsLoading(true);
        
        if (!query || query.trim() === '') {
          await fetchUniversities();
          return;
        }
        
        // Use textSearch to match across multiple columns
        const { data, error } = await supabase
          .from('universities')
          .select('id, name, city, country')
          .or(`name.ilike.*${query}*,city.ilike.*${query}*,country.ilike.*${query}*`)
          .limit(50);
          
        if (error) {
          console.error("Error searching universities:", error);
          setUniversities([]);
          return;
        }
        
        if (data) {
          // Cast the data to University type
          const typedData = data.map(uni => ({
            id: uni.id,
            name: uni.name,
            city: uni.city,
            country: uni.country
          })) as University[];
          
          // Sort results to prioritize matches in university name, then city, then country
          const sortedResults = sortUniversityResults(typedData, query);
          setUniversities(sortedResults);
        } else {
          setUniversities([]);
        }
      } catch (error) {
        console.error("Error in search operation:", error);
        setUniversities([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWithQuery();
  };

  // Helper function to sort results by relevance
  const sortUniversityResults = (universities: University[], query: string): University[] => {
    const lowerQuery = query.toLowerCase().trim();
    
    return [...universities].sort((a, b) => {
      // Priority 1: Exact match in name
      if (a.name.toLowerCase() === lowerQuery && b.name.toLowerCase() !== lowerQuery) return -1;
      if (b.name.toLowerCase() === lowerQuery && a.name.toLowerCase() !== lowerQuery) return 1;
      
      // Priority 2: Name starts with query
      if (a.name.toLowerCase().startsWith(lowerQuery) && !b.name.toLowerCase().startsWith(lowerQuery)) return -1;
      if (b.name.toLowerCase().startsWith(lowerQuery) && !a.name.toLowerCase().startsWith(lowerQuery)) return 1;
      
      // Priority 3: Name contains query
      const aNameContains = a.name.toLowerCase().includes(lowerQuery);
      const bNameContains = b.name.toLowerCase().includes(lowerQuery);
      if (aNameContains && !bNameContains) return -1;
      if (bNameContains && !aNameContains) return 1;
      
      // Priority 4: City match
      const aCityMatches = a.city && a.city.toLowerCase().includes(lowerQuery);
      const bCityMatches = b.city && b.city.toLowerCase().includes(lowerQuery);
      if (aCityMatches && !bCityMatches) return -1;
      if (bCityMatches && !aCityMatches) return 1;
      
      // Priority 5: Country match
      const aCountryMatches = a.country && a.country.toLowerCase().includes(lowerQuery);
      const bCountryMatches = b.country && b.country.toLowerCase().includes(lowerQuery);
      if (aCountryMatches && !bCountryMatches) return -1;
      if (bCountryMatches && !aCountryMatches) return 1;
      
      // Default: sort alphabetically by name
      return a.name.localeCompare(b.name);
    });
  };

  return {
    universities,
    isLoading,
    searchQuery,
    setSearchQuery,
    handleSearch
  };
}
