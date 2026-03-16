
import { useState, useEffect, useCallback, useRef } from "react";
import { University } from "./types";
import { useUniversitiesCache } from "@/hooks/useUniversitiesCache";
import { supabase } from "@/integrations/supabase/client";

// Hipo API response type
type HipoUniversity = {
  name: string;
  country: string;
  "state-province": string | null;
  alpha_two_code: string;
  domains: string[];
  web_pages: string[];
};

type AliasEntry = { alias: string; university_id: number };

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

const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID || "ceoflcktscennfmmdrvp";
const PROXY_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/university-search`;

// Module-level alias cache
let aliasCache: AliasEntry[] | null = null;

async function fetchAliases(): Promise<AliasEntry[]> {
  if (aliasCache) return aliasCache;
  const { data } = await supabase
    .from("university_aliases")
    .select("alias, university_id");
  aliasCache = (data as AliasEntry[]) || [];
  return aliasCache;
}

export function useUniversitySearch(prioritizeIrish = false) {
  const { universities: allUniversities, loading: isLoading } = useUniversitiesCache();
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiFallbackResults, setApiFallbackResults] = useState<University[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [aliases, setAliases] = useState<AliasEntry[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Load aliases once
  useEffect(() => {
    fetchAliases().then(setAliases);
  }, []);

  useEffect(() => {
    if (allUniversities.length > 0) {
      const initialList = prioritizeIrish 
        ? sortUniversitiesByIrishFirst([...allUniversities]) 
        : [...allUniversities];
      setUniversities(initialList.slice(0, 10));
    }
  }, [allUniversities, prioritizeIrish]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  // Build a set of university IDs that match a query via aliases
  const getAliasMatchIds = useCallback((query: string): Set<number> => {
    const q = normalizeString(query);
    const matchedIds = new Set<number>();
    for (const entry of aliases) {
      if (normalizeString(entry.alias).includes(q) || q.includes(normalizeString(entry.alias))) {
        matchedIds.add(entry.university_id);
      }
    }
    return matchedIds;
  }, [aliases]);

  const searchHipoApi = useCallback(async (query: string) => {
    if (query.length < 3) {
      setApiFallbackResults([]);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsSearchingApi(true);
    try {
      const response = await fetch(
        `${PROXY_URL}?name=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );
      if (!response.ok) throw new Error("API request failed");
      
      const data: HipoUniversity[] = await response.json();
      
      const mapped: University[] = data.slice(0, 10).map((item, index) => ({
        id: -(index + 1),
        name: item.name,
        city: null,
        country: item.country || null,
      }));

      const localNames = new Set(allUniversities.map(u => u.name.toLowerCase()));
      const filtered = mapped.filter(u => !localNames.has(u.name.toLowerCase()));

      setApiFallbackResults(filtered);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setApiFallbackResults([]);
      }
    } finally {
      setIsSearchingApi(false);
    }
  }, [allUniversities]);

  const handleSearch = useCallback((query: string) => {
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

    // Get IDs matched via aliases
    const aliasMatchIds = getAliasMatchIds(trimmedQuery);

    const filtered = allUniversities.filter((uni) => {
      // Direct text match
      const nameMatch = normalizeString(uni.name || "").includes(trimmedQuery);
      const cityMatch = normalizeString(uni.city || "").includes(trimmedQuery);
      const countryMatch = normalizeString(uni.country || "").includes(trimmedQuery);
      // Alias match
      const aliasMatch = aliasMatchIds.has(uni.id);
      return nameMatch || cityMatch || countryMatch || aliasMatch;
    });

    const sorted = sortUniversityResults(filtered, trimmedQuery, prioritizeIrish, aliasMatchIds);
    setUniversities(sorted);

    // Debounced API fallback when local results are few
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (sorted.length < 3 && query.trim().length >= 3) {
      debounceRef.current = setTimeout(() => {
        searchHipoApi(query.trim());
      }, 300);
    } else {
      setApiFallbackResults([]);
    }
  }, [allUniversities, prioritizeIrish, searchHipoApi, getAliasMatchIds]);

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

  const sortUniversityResults = (
    results: University[], query: string, prioritizeIrish: boolean, aliasMatchIds?: Set<number>
  ): University[] => {
    return [...results].sort((a, b) => {
      if (prioritizeIrish) {
        const aIsIrish = isIrishUniversity(a);
        const bIsIrish = isIrishUniversity(b);
        if (aIsIrish && !bIsIrish) return -1;
        if (!aIsIrish && bIsIrish) return 1;
      }
      const aScore = calculateRelevanceScore(a, query, aliasMatchIds);
      const bScore = calculateRelevanceScore(b, query, aliasMatchIds);
      if (bScore === aScore) return a.name.localeCompare(b.name);
      return bScore - aScore;
    });
  };
  
  const calculateRelevanceScore = (
    university: University, query: string, aliasMatchIds?: Set<number>
  ): number => {
    if (!university || !university.name) return 0;
    const nameLower = university.name.toLowerCase();
    const cityLower = university.city?.toLowerCase() || '';
    const countryLower = university.country?.toLowerCase() || '';
    let score = 0;

    // Exact alias match gets high priority
    if (aliasMatchIds?.has(university.id)) {
      // Check if query exactly matches an alias for this university
      const exactAlias = aliases.some(
        a => a.university_id === university.id && normalizeString(a.alias) === query
      );
      score += exactAlias ? 900 : 300;
    }

    if (nameLower === query) score += 1000;
    if (cityLower === query) score += 800;
    if (countryLower === query) score += 700;
    if (nameLower.startsWith(query)) score += 500;
    if (cityLower.startsWith(query)) score += 400;
    if (countryLower.startsWith(query)) score += 350;
    if (nameLower.includes(query)) score += 200;
    if (cityLower.includes(query)) score += 150;
    if (countryLower.includes(query)) score += 100;
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
