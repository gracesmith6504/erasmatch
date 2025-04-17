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

    const filtered = allUniversities.filter((uni) => {
      return (
        uni.name.toLowerCase().includes(lowerQuery) ||
        (uni.city && uni.city.toLowerCase().includes(lowerQuery)) ||
        (uni.country && uni.country.toLowerCase().includes(lowerQuery))
      );
    });

    const sorted = sortUniversityResults(filtered, lowerQuery);
    setUniversities(sorted);
  };

  const sortUniversityResults = (results: University[], query: string): University[] => {
    return [...results].sort((a, b) => {
      const queryIn = (field: string | null) =>
        field?.toLowerCase().includes(query) ? 1 : 0;

      const aScore =
        (a.name.toLowerCase() === query ? 100 : 0) +
        (a.name.toLowerCase().startsWith(query) ? 50 : 0) +
        queryIn(a.name) * 30 +
        queryIn(a.city) * 20 +
        queryIn(a.country) * 10;

      const bScore =
        (b.name.toLowerCase() === query ? 100 : 0) +
        (b.name.toLowerCase().startsWith(query) ? 50 : 0) +
        queryIn(b.name) * 30 +
        queryIn(b.city) * 20 +
        queryIn(b.country) * 10;

      return bScore - aScore;
    });
  };

  return {
    universities,
    isLoading,
    searchQuery,
    setSearchQuery,
    handleSearch,
  };
}
