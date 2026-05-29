
import { useState, useEffect, useCallback, useRef } from "react";
import { University } from "./types";
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

const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID || "ceoflcktscennfmmdrvp";
const PROXY_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/university-search`;

type SearchUniversityRow = University & { score?: number };

const DEFAULT_RESULT_LIMIT = 10;
const SEARCH_RESULT_LIMIT = 100;

export function useUniversitySearch(prioritizeIrish = false) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiFallbackResults, setApiFallbackResults] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const latestQueryRef = useRef("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const searchHipoApi = useCallback(async (query: string, localResults: University[]) => {
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

      const localNames = new Set(localResults.map(u => u.name.toLowerCase()));
      const filtered = mapped.filter(u => !localNames.has(u.name.toLowerCase()));

      setApiFallbackResults(filtered);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setApiFallbackResults([]);
      }
    } finally {
      setIsSearchingApi(false);
    }
  }, []);

  const searchUniversities = useCallback(async (query: string, immediate = false) => {
    const trimmedQuery = query.trim();
    latestQueryRef.current = trimmedQuery;
    setIsSearchingApi(Boolean(trimmedQuery));
    if (immediate) setIsLoading(true);

    const { data, error } = await (supabase as any).rpc("search_universities", {
      _q: trimmedQuery,
      _limit: trimmedQuery ? SEARCH_RESULT_LIMIT : DEFAULT_RESULT_LIMIT,
      _city: null,
    });

    if (latestQueryRef.current !== trimmedQuery) return;

    if (error) {
      console.error("Error searching universities:", error);
      setUniversities([]);
      setApiFallbackResults([]);
    } else {
      const rows = ((data ?? []) as SearchUniversityRow[]).map((row) => ({
        id: row.id,
        name: row.name,
        city: row.city,
        country: row.country,
      }));
      const sorted = prioritizeIrish ? sortUniversitiesByIrishFirst(rows) : rows;
      setUniversities(sorted);

      if (trimmedQuery.length >= 3 && sorted.length < 3) {
        searchHipoApi(trimmedQuery, sorted);
      } else {
        setApiFallbackResults([]);
      }
    }

    setIsSearchingApi(false);
    if (immediate) setIsLoading(false);
  }, [prioritizeIrish, searchHipoApi]);

  useEffect(() => {
    searchUniversities("", true);
  }, [searchUniversities]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsSearchingApi(Boolean(query.trim()));
    debounceRef.current = setTimeout(() => {
      searchUniversities(query);
    }, query.trim() ? 180 : 0);
  }, [searchUniversities]);

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

  return {
    universities,
    apiFallbackResults,
    isLoading,
    isSearchingApi,
    searchQuery,
    handleSearch,
  };
}
