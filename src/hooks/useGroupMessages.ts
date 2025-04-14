import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ChatMessage = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  university?: string;
  city?: string;
};

export function useGroupMessages(chatType: "university" | "city", groupId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const decodedId = groupId ? decodeURIComponent(groupId) : "";

  useEffect(() => {
    if (!decodedId) return;

    const tableName = chatType === "university" ? "group_messages" : "city_messages";
    const columnName = chatType === "university" ? "university" : "city";

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select("id, sender_id, content, created_at, university, city")
          .eq(columnName, decodedId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error("Failed to load messages:", err);
        toast.error("Could not fetch group messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`${chatType}-messages`) // avoids conflicts
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: tableName,
          filter: `${columnName}=eq.${decodedId}`,
        },
        (payload) => {
          const newMsg: ChatMessage = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatType, decodedId]);

  return { messages, loading };
}
