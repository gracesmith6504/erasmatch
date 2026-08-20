import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types";
import { useEffect, useRef } from "react";

/**
 * Lazily fetches direct messages for the current user.
 * Only runs when the Messages page mounts.
 */
export function useDirectMessages(currentUserId: string | null) {
  const queryClient = useQueryClient();
  const channelRef = useRef(0);

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

    // Unique channel name per effect invocation prevents the
    // "cannot add callbacks after subscribe()" crash on fast remounts.
    const channelName = `direct-messages-list-${currentUserId}-${++channelRef.current}`;

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ["direct-messages", currentUserId] });
    };

    const channel = supabase
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, queryClient]);

  return query;
}
