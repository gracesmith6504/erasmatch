
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { University } from "./types";

export function useUniversitySearch() {
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
        name: uni.name,
        city: uni.city,
        country: uni.country,
      })) as University[];

      setAllUniversities(typedData);
      setUniversities(typedData); // show all by default
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

    const lowerQuery = query.trim().toLowerCase();

    if (!lowerQuery) {
      setUniversities(allUniversities);
      return;
    }

    // Filter universities based on name, city or country
    const filtered = allUniversities.filter((uni) => {
      const nameMatch = uni.name.toLowerCase().includes(lowerQuery);
      const cityMatch = uni.city && uni.city.toLowerCase().includes(lowerQuery);
      const countryMatch = uni.country && uni.country.toLowerCase().includes(lowerQuery);
      
      return nameMatch || cityMatch || countryMatch;
    });

    // Sort results by relevance
    const sorted = sortUniversityResults(filtered, lowerQuery);
    setUniversities(sorted);
  };

  const sortUniversityResults = (results: University[], query: string): University[] => {
    return [...results].sort((a, b) => {
      // Calculate relevance scores based on match type
      // Prioritize: exact name match > name starts with > name includes > city > country
      
      const aNameLower = a.name.toLowerCase();
      const bNameLower = b.name.toLowerCase();
      
      // Score calculation for each university
      const aScore = calculateRelevanceScore(a, query);
      const bScore = calculateRelevanceScore(b, query);
      
      return bScore - aScore; // Higher score first
    });
  };
  
  const calculateRelevanceScore = (university: University, query: string): number => {
    const nameLower = university.name.toLowerCase();
    const cityLower = university.city?.toLowerCase() || '';
    const countryLower = university.country?.toLowerCase() || '';
    
    let score = 0;
    
    // Exact name match (highest priority)
    if (nameLower === query) {
      score += 1000;
    }
    
    // Name starts with query (high priority)
    if (nameLower.startsWith(query)) {
      score += 500;
    }
    
    // Name includes query (medium priority)
    if (nameLower.includes(query)) {
      score += 200;
    }
    
    // City match (lower priority)
    if (cityLower.includes(query)) {
      score += 100;
    }
    
    // Country match (lowest priority)
    if (countryLower.includes(query)) {
      score += 50;
    }
    
    // Additional factor: position of match in name (earlier = better)
    const nameMatchPos = nameLower.indexOf(query);
    if (nameMatchPos !== -1) {
      // Inverted position (earlier match = higher score)
      score += Math.max(0, 50 - nameMatchPos);
    }
    
    return score;
  };

  return {
    universities,
    isLoading,
    searchQuery,
    setSearchQuery,
    handleSearch,
  };
}
