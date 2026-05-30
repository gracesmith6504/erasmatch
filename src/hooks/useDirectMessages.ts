import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types";
import { useEffect } from "react";

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
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Message[];
    },
    enabled: !!currentUserId,
  });

  // Subscribe to realtime changes and invalidate the cache
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel("direct-messages-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["direct-messages", currentUserId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, queryClient]);

  return query;
}
