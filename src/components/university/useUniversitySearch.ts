
import { useState, useEffect } from "react";
import { University } from "./types";
import { useUniversitiesCache } from "@/hooks/useUniversitiesCache";

// List of Irish universities to prioritize for the "Home University" dropdown
const IRISH_UNIVERSITIES = [
  "Trinity College Dublin",
  "University College Dublin",
  "Technological University Dublin",
  "Dublin City University",
  "University of Galway",
  "University College Cork",
  "University of Limerick",
  "Maynooth University",
  "Queen's University Belfast"
];
const normalizeString = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function useUniversitySearch(prioritizeIrish = false) {
  const { universities: allUniversities, loading: isLoading } = useUniversitiesCache();
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (allUniversities.length > 0) {
      // Initial list - sorted with Irish universities first if prioritizeIrish is true
      const initialList = prioritizeIrish 
        ? sortUniversitiesByIrishFirst([...allUniversities]) 
        : [...allUniversities];
      
      setUniversities(initialList.slice(0, 10)); // Just show first 10 initially for better performance
    }
  }, [allUniversities, prioritizeIrish]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    const trimmedQuery = normalizeString(query.trim());
    
    if (!trimmedQuery) {
      // When no search query, show all universities or just top 10
      // If prioritizing Irish universities, sort them first
      const defaultList = prioritizeIrish 
        ? sortUniversitiesByIrishFirst([...allUniversities]) 
        : [...allUniversities];
      
      setUniversities(defaultList.slice(0, 10));
      return;
    }

    // Filter universities based on name, city or country
      const filtered = allUniversities.filter((uni) => {
        const nameMatch = normalizeString(uni.name || "").includes(trimmedQuery);
        const cityMatch = normalizeString(uni.city || "").includes(trimmedQuery);
        const countryMatch = normalizeString(uni.country || "").includes(trimmedQuery);
      
        return nameMatch || cityMatch || countryMatch;
      });


    // Sort results by relevance, considering Irish universities if needed
    const sorted = sortUniversityResults(filtered, trimmedQuery, prioritizeIrish);
    setUniversities(sorted);
  };
  
  const sortUniversitiesByIrishFirst = (universities: University[]): University[] => {
    return [...universities].sort((a, b) => {
      const aIsIrish = isIrishUniversity(a);
      const bIsIrish = isIrishUniversity(b);
      
      if (aIsIrish && !bIsIrish) return -1;
      if (!aIsIrish && bIsIrish) return 1;
      
      // If both or neither are Irish, sort alphabetically
      return a.name.localeCompare(b.name);
    });
  };
  
  const isIrishUniversity = (university: University): boolean => {
    return IRISH_UNIVERSITIES.includes(university.name) || 
           university.country?.toLowerCase() === "ireland" ||
           university.city?.toLowerCase() === "dublin" ||
           university.city?.toLowerCase() === "galway" ||
           university.city?.toLowerCase() === "cork" ||
           university.city?.toLowerCase() === "limerick" ||
           university.city?.toLowerCase() === "maynooth" ||
           university.city?.toLowerCase() === "belfast";
  };

  const sortUniversityResults = (results: University[], query: string, prioritizeIrish: boolean): University[] => {
    return [...results].sort((a, b) => {
      // If prioritizing Irish universities
      if (prioritizeIrish) {
        const aIsIrish = isIrishUniversity(a);
        const bIsIrish = isIrishUniversity(b);
        
        if (aIsIrish && !bIsIrish) return -1;
        if (!aIsIrish && bIsIrish) return 1;
      }
      
      const aScore = calculateRelevanceScore(a, query);
      const bScore = calculateRelevanceScore(b, query);
      
      // If scores are equal, sort alphabetically by name
      if (bScore === aScore) {
        return a.name.localeCompare(b.name);
      }
      
      return bScore - aScore; // Higher score first
    });
  };
  
  const calculateRelevanceScore = (university: University, query: string): number => {
    if (!university || !university.name) return 0;
    
    const nameLower = university.name.toLowerCase();
    const cityLower = university.city?.toLowerCase() || '';
    const countryLower = university.country?.toLowerCase() || '';
    
    let score = 0;
    
    // Exact match scenarios (highest priority)
    if (nameLower === query) score += 1000;
    if (cityLower === query) score += 800;
    if (countryLower === query) score += 700;
    
    // Starts with query (high priority)
    if (nameLower.startsWith(query)) score += 500;
    if (cityLower?.startsWith(query)) score += 400;
    if (countryLower?.startsWith(query)) score += 350;
    
    // Contains query (medium priority)
    if (nameLower.includes(query)) score += 200;
    if (cityLower?.includes(query)) score += 150;
    if (countryLower?.includes(query)) score += 100;
    
    // Additional factor: position of match in name (earlier = better)
    const nameMatchPos = nameLower.indexOf(query);
    if (nameMatchPos !== -1) {
      score += Math.max(0, 50 - nameMatchPos);
    }
    
    return score;
  };

  return {
    universities,
    isLoading,
    searchQuery,
    handleSearch,
  };
}
