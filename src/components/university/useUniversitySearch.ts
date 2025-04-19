import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { University } from "./types";

export function useUniversitySearch(prioritizeIrish?: boolean) {
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching universities...");

      const { data, error } = await supabase
        .from("universities")
        .select("id, name, city, country");

      if (error) {
        console.error("Error fetching universities:", error);
        setAllUniversities([]);
        setUniversities([]);
        return;
      }

      const typedData = data.map((uni) => ({
        id: uni.id,
        name: uni.name || "",
        city: uni.city || null,
        country: uni.country || null,
      })) as University[];

      console.log("Fetched universities:", typedData.length);
      
      // Sort universities alphabetically by name
      let sortedData = [...typedData].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      
      // If prioritizeIrish is true, prioritize Irish universities
      if (prioritizeIrish) {
        sortedData = sortedData.sort((a, b) => {
          // Check if either university is Irish
          const aIsIrish = a.country?.toLowerCase() === 'ireland';
          const bIsIrish = b.country?.toLowerCase() === 'ireland';
          
          // If a is Irish and b is not, a comes first
          if (aIsIrish && !bIsIrish) return -1;
          // If b is Irish and a is not, b comes first
          if (!aIsIrish && bIsIrish) return 1;
          // Otherwise, maintain alphabetical order
          return 0;
        });
      }
      
      setAllUniversities(sortedData);
      setUniversities(sortedData.slice(0, 10)); // Show first 10 initially
    } catch (error) {
      console.error("Error in fetchUniversities:", error);
      setAllUniversities([]);
      setUniversities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    const trimmedQuery = query.trim().toLowerCase();
    
    if (!trimmedQuery) {
      // When no search query, show only first 10 universities
      setUniversities(allUniversities.slice(0, 10));
      return;
    }

    // Simple filtering based on name, city, or country
    const filtered = allUniversities.filter((uni) => {
      const nameMatch = uni.name.toLowerCase().includes(trimmedQuery);
      const cityMatch = uni.city?.toLowerCase()?.includes(trimmedQuery) || false;
      const countryMatch = uni.country?.toLowerCase()?.includes(trimmedQuery) || false;
      
      return nameMatch || cityMatch || countryMatch;
    });

    // Show all matching results when there's a search query
    setUniversities(filtered);
  };

  return {
    universities,
    isLoading,
    searchQuery,
    handleSearch,
  };
}
