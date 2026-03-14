import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useUnreadMessageCount() {
  const [count, setCount] = useState(0);
  const { currentUserId, isAuthenticated } = useAuth();

  const fetchCount = async () => {
    if (!currentUserId) return;
    const { count: unread, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("receiver_id", currentUserId)
      .not("read_by", "cs", `{${currentUserId}}`);

    if (!error && unread !== null) setCount(unread);
  };

  useEffect(() => {
    if (!isAuthenticated || !currentUserId) {
      setCount(0);
      return;
    }

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
  }, [isAuthenticated, currentUserId]);

  return count;
}
