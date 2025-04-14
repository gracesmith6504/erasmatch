
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
  const [error, setError] = useState<Error | null>(null);

  const decodedId = groupId ? decodeURIComponent(groupId) : "";

  useEffect(() => {
    if (!decodedId) return;

    const tableName = chatType === "university" ? "group_messages" : "city_messages";
    const columnName = chatType === "university" ? "university_name" : "city_name";

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select("id, sender_id, content, created_at, university_name, city_name")
          .eq(columnName, decodedId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (err: any) {
        console.error("Failed to load messages:", err);
        setError(err);
        toast.error("Could not fetch group messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up realtime subscription
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
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatType, decodedId]);

  // Add the sendMessage function
  const sendMessage = async (content: string, currentUserId: string): Promise<boolean> => {
    try {
      const tableName = chatType === "university" ? "group_messages" : "city_messages";
      const columnName = chatType === "university" ? "university_name" : "city_name";
      
      const messageData = {
        sender_id: currentUserId,
        content: content,
        [columnName]: decodedId,
      };

      const { error } = await supabase
        .from(tableName)
        .insert([messageData]);

      if (error) throw error;
      
      return true;
    } catch (err: any) {
      console.error("Error sending message:", err);
      toast.error(`Failed to send message: ${err.message}`);
      return false;
    }
  };

  return { messages, loading, error, sendMessage };
}
