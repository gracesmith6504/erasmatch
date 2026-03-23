import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";

/**
 * Page-scoped hook to fetch all profiles. Uses React Query for caching
 * so data is only fetched when the consuming page mounts.
 */
export function useProfiles(enabled = true) {
  return useQuery<Profile[]>({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, name, avatar_url, university, city, personality_tags, bio, home_university, semester, course, looking_for, ref_code, arrival_date, last_active_at, deleted_at, featured"
        )
        .is("deleted_at", null);

      if (error) throw error;

      return (data ?? []).map((profile) => ({
        ...profile,
        country: null,
        interests: null,
        personality_tags: profile.personality_tags || [],
      })) as Profile[];
    },
    enabled,
  });
}
