import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Module-level counter — survives component remounts and ErrorBoundary recovery. */
let channelSeq = 0;

export function useUnreadMessageCount(currentUserId: string | null) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!currentUserId) {
      setCount(0);
      return;
    }

    // Module-level counter ensures truly unique channel names even after
    // ErrorBoundary remounts (which reset useRef to initial value).
    const channelName = `unread-msg-count-${currentUserId}-${++channelSeq}`;

    let cancelled = false;

    const fetchCount = async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: unread, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", currentUserId)
        .not("read_by", "cs", `{${currentUserId}}`)
        .gte("created_at", thirtyDaysAgo.toISOString());

      if (error) {
        console.error("Error fetching unread count:", error);
        return;
      }
      if (!cancelled && unread !== null) setCount(unread);
    };

    fetchCount();

    // Realtime subscription — wrapped in try-catch so a Supabase client
    // error (e.g. "cannot add callbacks after subscribe()") degrades to
    // polling instead of crashing the entire app via ErrorBoundary.
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    try {
      channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages", filter: `receiver_id=eq.${currentUserId}` },
          () => fetchCount()
        )
        .subscribe();
    } catch (err) {
      console.warn("Realtime subscription failed, falling back to polling:", err);
      // Poll every 30s as fallback when realtime isn't available
      pollTimer = setInterval(fetchCount, 30_000);
    }

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [currentUserId]);

  return count;
}

/**
 * Marks all messages in a thread from a specific sender as read by the current user.
 */
export async function markMessagesAsRead(currentUserId: string, partnerId: string) {
  const { error } = await supabase.rpc("mark_thread_read", {
    p_partner_id: partnerId,
  });

  if (error) {
    console.error("Error marking messages as read:", error);
  }
}
