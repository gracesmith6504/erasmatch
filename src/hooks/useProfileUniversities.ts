import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";

/**
 * Lightweight alternative to useUniversitiesCache for the Students page.
 *
 * Instead of loading the entire universities table (12,000+ rows across
 * 13 paginated requests), this hook extracts the unique university names
 * from the already-loaded profiles and fetches only those rows — typically
 * ~300 in a single request. The result has the same shape, so callers can
 * build universityCityMap / universityCountryMap identically.
 */
export function useProfileUniversities(profiles: Profile[]) {
  const universityNames = useMemo(() => {
    const names = new Set<string>();
    for (const p of profiles) {
      if (p.university) names.add(p.university);
    }
    return Array.from(names).sort();
  }, [profiles]);

  return useQuery<
    Array<{ id: number; name: string; city: string | null; country: string | null }>
  >({
    queryKey: ["profile-universities", universityNames],
    queryFn: async () => {
      if (universityNames.length === 0) return [];
      const { data, error } = await supabase
        .from("universities")
        .select("id, name, city, country")
        .in("name", universityNames);
      if (error) throw error;
      return data ?? [];
    },
    enabled: universityNames.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
