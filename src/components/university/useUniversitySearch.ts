
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
        .select("id, name, city, country")
        .order('name');

      if (error) throw error;

      const typedData = data.map((uni) => ({
        id: uni.id,
        name: uni.name || "",
        city: uni.city || null,
        country: uni.country || null,
      })) as University[];

      setAllUniversities(typedData);
      setUniversities(typedData.slice(0, 10)); // Initial 10 results
    } catch (error) {
      console.error("Error fetching universities:", error);
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
      setUniversities(allUniversities.slice(0, 10)); // Show first 10 when empty
      return;
    }

    // Simple filtering on name, city, or country
    const filtered = allUniversities.filter((uni) => {
      return uni.name.toLowerCase().includes(trimmedQuery) ||
             (uni.city?.toLowerCase()?.includes(trimmedQuery) || false) ||
             (uni.country?.toLowerCase()?.includes(trimmedQuery) || false);
    });

    setUniversities(filtered); // Show all matches when searching
  };

  return {
    universities,
    isLoading,
    searchQuery,
    handleSearch,
  };
}
