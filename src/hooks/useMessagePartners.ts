import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message, Profile } from "@/types";

/**
 * Fetches only the profiles of users the current user has exchanged messages
 * with — typically 5–30 rows instead of the full 2,000-row profiles table.
 *
 * Optionally includes an extra ID (e.g. from ?user= URL param) so that
 * navigating to message someone new still resolves their profile.
 */
export function useMessagePartners(
  messages: Message[],
  currentUserId: string | null,
  extraId?: string | null
) {
  const partnerIds = useMemo(() => {
    if (!currentUserId) return [];
    const ids = new Set<string>();
    ids.add(currentUserId); // always include self for currentUserProfile
    for (const m of messages) {
      if (m.sender_id === currentUserId) ids.add(m.receiver_id);
      else if (m.receiver_id === currentUserId) ids.add(m.sender_id);
    }
    if (extraId) ids.add(extraId);
    return Array.from(ids);
  }, [messages, currentUserId, extraId]);

  return useQuery<Profile[]>({
    queryKey: ["message-partners", partnerIds],
    queryFn: async () => {
      if (partnerIds.length === 0) return [];

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, name, avatar_url, university, city, personality_tags, bio, home_university, semester, course, looking_for, last_active_at, created_at, deleted_at"
        )
        .in("id", partnerIds);

      if (error) throw error;

      return (data ?? []).map((p) => ({
        ...p,
        country: null,
        interests: null,
        personality_tags: p.personality_tags || [],
      })) as Profile[];
    },
    enabled: partnerIds.length > 0,
    staleTime: 60_000, // 1 min — realtime subscription handles new messages
  });
}
