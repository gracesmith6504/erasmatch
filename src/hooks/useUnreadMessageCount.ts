import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUnreadMessageCount(currentUserId: string | null) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!currentUserId) {
      setCount(0);
      return;
    }

    const fetchCount = async () => {
      const { count: unread, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", currentUserId)
        .not("read_by", "cs", `{${currentUserId}}`);

      if (!error && unread !== null) setCount(unread);
    };

    fetchCount();

    const channel = supabase
      .channel("unread-messages-count")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => fetchCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  return count;
}
