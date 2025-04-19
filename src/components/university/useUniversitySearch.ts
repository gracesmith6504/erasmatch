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
    setIsLoading(true);
    const { data, error } = await supabase
      .from("universities")
      .select("id, name, city, country")
      .order("name");

    if (error) {
      console.error("Failed to fetch universities:", error);
      setAllUniversities([]);
      setUniversities([]);
      return;
    }

    const cleaned = data.map((uni) => ({
      id: uni.id,
      name: uni.name || "",
      city: uni.city || "",
      country: uni.country || "",
    })) as University[];

    setAllUniversities(cleaned);
    setUniversities(
      prioritizeIrish
        ? prioritizeIrishUnis(cleaned).slice(0, 10)
        : cleaned.slice(0, 10)
    );
    setIsLoading(false);
  };

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    setSearchQuery(query);

    if (!trimmedQuery) {
      setUniversities(
        prioritizeIrish
          ? prioritizeIrishUnis(allUniversities).slice(0, 10)
          : allUniversities.slice(0, 10)
      );
      return;
    }

    const filtered = allUniversities.filter((uni) =>
      [uni.name, uni.city, uni.country]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(trimmedQuery))
    );

    setUniversities(filtered); // show all matches
  };

  const prioritizeIrishUnis = (list: University[]) => {
    return [...list].sort((a, b) => {
      const isIrish = (u: University) =>
        u.country.toLowerCase() === "ireland" ||
        ["dublin", "galway", "cork", "maynooth", "limerick", "belfast"].includes(
          u.city.toLowerCase()
        );

      const aIsIrish = isIrish(a);
      const bIsIrish = isIrish(b);

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
