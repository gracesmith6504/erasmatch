
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GroupMessage, CityMessage } from "@/types";
import { toast } from "sonner";

// Define a simple union type for messages
type MessageType = GroupMessage | CityMessage;

export function useGroupMessages(
  chatType: "university" | "city",
  groupId: string
) {
  // Use a simpler type declaration to avoid excessive depth
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);

  const decodedId = groupId ? decodeURIComponent(groupId) : "";
  
  useEffect(() => {
    const fetchMessages = async () => {
      if (!decodedId) return;
      
      setLoading(true);
      
      try {
        const tableName = chatType === "university" ? "group_messages" : "city_messages";
        const columnName = chatType === "university" ? "university_name" : "city_name";
        
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq(columnName, decodedId)
          .order("created_at", { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          setMessages(data as MessageType[]);
        }
      } catch (error) {
        console.error(`Error fetching ${chatType} messages:`, error);
        toast.error(`Failed to load messages`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription
    const tableName = chatType === "university" ? "group_messages" : "city_messages";
    const columnName = chatType === "university" ? "university_name" : "city_name";
    
    const channel = supabase
      .channel(`${chatType}-messages-changes`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: tableName,
          filter: `${columnName}=eq.${decodedId}`,
        },
        (payload) => {
          // Use a basic object type instead of a complex nested type
          const newData = payload.new as {
            id: string;
            sender_id: string;
            content: string;
            created_at: string;
            university_name?: string;
            city_name?: string;
          };
          
          // Create new message with the appropriate type
          if (chatType === "university") {
            const newMsg: GroupMessage = {
              id: newData.id,
              sender_id: newData.sender_id,
              content: newData.content,
              created_at: newData.created_at,
              university_name: newData.university_name || decodedId
            };
            setMessages((prevMessages) => [...prevMessages, newMsg]);
          } else {
            const newMsg: CityMessage = {
              id: newData.id,
              sender_id: newData.sender_id,
              content: newData.content,
              created_at: newData.created_at,
              city_name: newData.city_name || decodedId
            };
            setMessages((prevMessages) => [...prevMessages, newMsg]);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [decodedId, chatType]);

  return { messages, loading };
}
