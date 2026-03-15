import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  actor_id: string;
  reference_id: string | null;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  actor_profile?: {
    name: string | null;
    avatar_url: string | null;
  };
}

export function useNotifications(currentUserId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!currentUserId) return;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await (supabase as any)
      .from("notifications")
      .select("*")
      .eq("user_id", currentUserId)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }

    if (!data || data.length === 0) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Fetch actor profiles
    const actorIds = [...new Set(data.map((n: any) => n.actor_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name, avatar_url")
      .in("id", actorIds);

    const profileMap = new Map(
      (profiles || []).map((p) => [p.id, { name: p.name, avatar_url: p.avatar_url }])
    );

    const enriched: Notification[] = data.map((n: any) => ({
      ...n,
      actor_profile: profileMap.get(n.actor_id) || null,
    }));

    setNotifications(enriched);
    setUnreadCount(enriched.filter((n) => !n.read).length);
  }, [currentUserId]);

  const markAllAsRead = useCallback(async () => {
    if (!currentUserId) return;

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", currentUserId)
      .eq("read", false);

    if (error) {
      console.error("Error marking notifications as read:", error);
      return;
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUserId}`,
        },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, fetchNotifications]);

  return { notifications, unreadCount, markAllAsRead };
}
