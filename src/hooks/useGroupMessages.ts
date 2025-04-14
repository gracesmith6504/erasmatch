
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GroupMessage, CityMessage, Profile } from "@/types";
import { toast } from "sonner";

// Simplified payload type for real-time updates
type RealtimePayload = {
  new: Record<string, any>;
  [key: string]: any;
};

export function useGroupMessages(
  chatType: "university" | "city",
  groupId: string
) {
  const [messages, setMessages] = useState<(GroupMessage | CityMessage)[]>([]);
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
          setMessages(data as (GroupMessage | CityMessage)[]);
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
        (payload: RealtimePayload) => {
          if (payload && payload.new) {
            const newData = payload.new;
            
            // Create message with basic properties first
            const newMsg: Partial<GroupMessage | CityMessage> = {
              id: newData.id,
              sender_id: newData.sender_id,
              content: newData.content,
              created_at: newData.created_at
            };
            
            // Add type-specific property
            if (chatType === "university") {
              (newMsg as Partial<GroupMessage>).university_name = newData.university_name;
            } else {
              (newMsg as Partial<CityMessage>).city_name = newData.city_name;
            }
            
            setMessages((prevMessages) => [...prevMessages, newMsg as (GroupMessage | CityMessage)]);
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
