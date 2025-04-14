
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define a simple ChatMessage type without any recursive dependencies
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
        // Use explicit type annotation to prevent deep type inference
        const { data, error } = await supabase
          .from(tableName)
          .select("id, sender_id, content, created_at")
          .eq(columnName, decodedId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        
        // Map the data to our ChatMessage type with the correct fields
        const mappedMessages: ChatMessage[] = (data || []).map((item: any) => ({
          id: item.id,
          sender_id: item.sender_id,
          content: item.content,
          created_at: item.created_at,
          university: chatType === "university" ? decodedId : undefined,
          city: chatType === "city" ? decodedId : undefined
        }));
        
        setMessages(mappedMessages);
      } catch (err: any) {
        console.error("Failed to load messages:", err);
        setError(err);
        toast.error("Could not fetch group messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up realtime subscription with proper typing
    const channel = supabase
      .channel(`${chatType}-messages`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: tableName,
          filter: `${columnName}=eq.${decodedId}`,
        },
        (payload) => {
          const newMessage: ChatMessage = {
            id: payload.new.id,
            sender_id: payload.new.sender_id,
            content: payload.new.content,
            created_at: payload.new.created_at,
            university: chatType === "university" ? decodedId : undefined,
            city: chatType === "city" ? decodedId : undefined
          };
          
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatType, decodedId]);

  // Send message function with explicit typing
  const sendMessage = async (content: string, currentUserId: string): Promise<boolean> => {
    try {
      const tableName = chatType === "university" ? "group_messages" : "city_messages";
      const columnName = chatType === "university" ? "university_name" : "city_name";
      
      // Create the message data with specific types based on chat type
      if (chatType === "university") {
        const { error } = await supabase
          .from(tableName)
          .insert({
            sender_id: currentUserId,
            content: content,
            university_name: decodedId
          });
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from(tableName)
          .insert({
            sender_id: currentUserId,
            content: content,
            city_name: decodedId
          });
        
        if (error) throw error;
      }
      
      return true;
    } catch (err: any) {
      console.error("Error sending message:", err);
      toast.error(`Failed to send message: ${err.message}`);
      return false;
    }
  };

  return { messages, loading, error, sendMessage };
}
