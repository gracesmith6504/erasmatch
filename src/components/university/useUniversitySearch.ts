
import { useState, useEffect, useCallback } from "react";
import { University } from "./types";
import { useUniversitiesCache } from "@/hooks/useUniversitiesCache";

// Hipo API response type
type HipoUniversity = {
  name: string;
  country: string;
  "state-province": string | null;
  alpha_two_code: string;
  domains: string[];
  web_pages: string[];
};

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
  const [apiFallbackResults, setApiFallbackResults] = useState<University[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);

  useEffect(() => {
    if (allUniversities.length > 0) {
      const initialList = prioritizeIrish 
        ? sortUniversitiesByIrishFirst([...allUniversities]) 
        : [...allUniversities];
      
      setUniversities(initialList.slice(0, 10));
    }
  }, [allUniversities, prioritizeIrish]);

  // Debounced Hipo API fallback search
  const searchHipoApi = useCallback(async (query: string) => {
    if (query.length < 3) {
      setApiFallbackResults([]);
      return;
    }

    setIsSearchingApi(true);
    try {
      const response = await fetch(
        `https://universities.hipolabs.com/search?name=${encodeURIComponent(query)}&limit=10`
      );
      if (!response.ok) throw new Error("API request failed");
      
      const data: HipoUniversity[] = await response.json();
      
      // Convert to our University type, using negative IDs to distinguish from DB entries
      const mapped: University[] = data.slice(0, 10).map((item, index) => ({
        id: -(index + 1), // Negative ID = from API, not in DB
        name: item.name,
        city: null, // Hipo doesn't provide city
        country: item.country || null,
      }));

      // Filter out universities already in our local DB (case-insensitive)
      const localNames = new Set(allUniversities.map(u => u.name.toLowerCase()));
      const filtered = mapped.filter(u => !localNames.has(u.name.toLowerCase()));

      setApiFallbackResults(filtered);
    } catch (err) {
      console.error("Hipo API fallback error:", err);
      setApiFallbackResults([]);
    } finally {
      setIsSearchingApi(false);
    }
  }, [allUniversities]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    const trimmedQuery = normalizeString(query.trim());
    
    if (!trimmedQuery) {
      const defaultList = prioritizeIrish 
        ? sortUniversitiesByIrishFirst([...allUniversities]) 
        : [...allUniversities];
      
      setUniversities(defaultList.slice(0, 10));
      setApiFallbackResults([]);
      return;
    }

    // Filter local universities
    const filtered = allUniversities.filter((uni) => {
      const nameMatch = normalizeString(uni.name || "").includes(trimmedQuery);
      const cityMatch = normalizeString(uni.city || "").includes(trimmedQuery);
      const countryMatch = normalizeString(uni.country || "").includes(trimmedQuery);
      return nameMatch || cityMatch || countryMatch;
    });

    const sorted = sortUniversityResults(filtered, trimmedQuery, prioritizeIrish);
    setUniversities(sorted);

    // If local results are few, trigger API fallback
    if (sorted.length < 3 && query.trim().length >= 3) {
      searchHipoApi(query.trim());
    } else {
      setApiFallbackResults([]);
    }
  };
  
  const sortUniversitiesByIrishFirst = (universities: University[]): University[] => {
    return [...universities].sort((a, b) => {
      const aIsIrish = isIrishUniversity(a);
      const bIsIrish = isIrishUniversity(b);
      if (aIsIrish && !bIsIrish) return -1;
      if (!aIsIrish && bIsIrish) return 1;
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
      if (prioritizeIrish) {
        const aIsIrish = isIrishUniversity(a);
        const bIsIrish = isIrishUniversity(b);
        if (aIsIrish && !bIsIrish) return -1;
        if (!aIsIrish && bIsIrish) return 1;
      }
      const aScore = calculateRelevanceScore(a, query);
      const bScore = calculateRelevanceScore(b, query);
      if (bScore === aScore) return a.name.localeCompare(b.name);
      return bScore - aScore;
    });
  };
  
  const calculateRelevanceScore = (university: University, query: string): number => {
    if (!university || !university.name) return 0;
    const nameLower = university.name.toLowerCase();
    const cityLower = university.city?.toLowerCase() || '';
    const countryLower = university.country?.toLowerCase() || '';
    let score = 0;
    if (nameLower === query) score += 1000;
    if (cityLower === query) score += 800;
    if (countryLower === query) score += 700;
    if (nameLower.startsWith(query)) score += 500;
    if (cityLower?.startsWith(query)) score += 400;
    if (countryLower?.startsWith(query)) score += 350;
    if (nameLower.includes(query)) score += 200;
    if (cityLower?.includes(query)) score += 150;
    if (countryLower?.includes(query)) score += 100;
    const nameMatchPos = nameLower.indexOf(query);
    if (nameMatchPos !== -1) score += Math.max(0, 50 - nameMatchPos);
    return score;
  };

  return {
    universities,
    apiFallbackResults,
    isLoading,
    isSearchingApi,
    searchQuery,
    handleSearch,
  };
}
