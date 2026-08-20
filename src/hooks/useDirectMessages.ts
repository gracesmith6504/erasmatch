import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types";
import { useEffect } from "react";

/** Module-level counter — survives component remounts and ErrorBoundary recovery. */
let channelSeq = 0;

/**
 * Lazily fetches direct messages for the current user.
 * Only runs when the Messages page mounts.
 */
export function useDirectMessages(currentUserId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery<Message[]>({
    queryKey: ["direct-messages", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];

      const { data, error } = await supabase
        .from("messages")
        .select("id, sender_id, receiver_id, content, created_at, read_by")
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;
      return (data ?? []) as Message[];
    },
    enabled: !!currentUserId,
    staleTime: 30_000, // 30s — realtime subscription handles new messages
  });

  // Subscribe to realtime changes and invalidate the cache
  useEffect(() => {
    if (!currentUserId) return;

    const channelName = `dm-list-${currentUserId}-${++channelSeq}`;

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ["direct-messages", currentUserId] });
    };

    let channel: ReturnType<typeof supabase.channel> | null = null;

    try {
      channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages", filter: `receiver_id=eq.${currentUserId}` },
          invalidate
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages", filter: `sender_id=eq.${currentUserId}` },
          invalidate
        )
        .subscribe();
    } catch (err) {
      console.warn("DM realtime subscription failed:", err);
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [currentUserId, queryClient]);

  return query;
}
