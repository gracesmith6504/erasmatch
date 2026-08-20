import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUnreadMessageCount(currentUserId: string | null) {
  const [count, setCount] = useState(0);
  const channelRef = useRef(0);

  useEffect(() => {
    if (!currentUserId) {
      setCount(0);
      return;
    }

    // Unique channel name per effect invocation prevents the
    // "cannot add callbacks after subscribe()" crash that occurs when
    // React remounts faster than removeChannel finishes unsubscribing.
    const channelName = `unread-messages-count-${currentUserId}-${++channelRef.current}`;

    const fetchCount = async () => {
      // Get messages where user is receiver and hasn't read them
      // read_by can be null or an array not containing the user
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
      if (unread !== null) setCount(unread);
    };

    fetchCount();

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `receiver_id=eq.${currentUserId}` },
        () => fetchCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
