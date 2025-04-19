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
      const { data, error } = await supabase
        .from("universities")
        .select("id, name, city, country")
        .order("name");

      if (error) throw error;

      const typedData = data.map((uni) => ({
        id: uni.id,
        name: uni.name || "",
        city: uni.city || null,
        country: uni.country || null,
      })) as University[];

      setAllUniversities(typedData);
      const defaultList = prioritizeIrish
        ? sortIrishFirst(typedData)
        : typedData;

      setUniversities(defaultList.slice(0, 10));
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
      const defaultList = prioritizeIrish
        ? sortIrishFirst(allUniversities)
        : allUniversities;
      setUniversities(defaultList.slice(0, 10));
      return;
    }

    const filtered = allUniversities.filter((uni) => {
      return uni.name.toLowerCase().includes(trimmedQuery) ||
             (uni.city?.toLowerCase().includes(trimmedQuery) ?? false) ||
             (uni.country?.toLowerCase().includes(trimmedQuery) ?? false);
    });

    setUniversities(filtered); // Show all matches while typing
  };

  const sortIrishFirst = (universities: University[]) => {
    return [...universities].sort((a, b) => {
      const aIsIrish = a.country?.toLowerCase() === "ireland";
      const bIsIrish = b.country?.toLowerCase() === "ireland";

      if (aIsIrish && !bIsIrish) return -1;
      if (!aIsIrish && bIsIrish) return 1;

      return a.name.localeCompare(b.name);
    });
  };

  return {
    universities,
    isLoading,
    searchQuery,
    handleSearch,
  };
}
