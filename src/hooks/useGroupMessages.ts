
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GroupMessage, CityMessage } from "@/types";

type UseGroupMessagesProps = {
  chatType: "university" | "city";
  chatName: string;
};

// Use more specific type for the payload to avoid deep recursion
type MessagePayload = {
  new: {
    id: string;
    sender_id: string;
    content: string;
    created_at: string;
    [key: string]: any; // To accommodate both university_name and city_name
  };
};

export const useGroupMessages = ({ chatType, chatName }: UseGroupMessagesProps) => {
  // Use union type instead of generic type parameter
  const [messages, setMessages] = useState<(GroupMessage | CityMessage)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        
        const tableName = chatType === "university" ? "group_messages" : "city_messages";
        const nameField = chatType === "university" ? "university_name" : "city_name";
        
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq(nameField, chatName)
          .order("created_at", { ascending: true });
          
        if (error) {
          throw error;
        }
        
        setMessages(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error(`Error fetching ${chatType} messages:`, err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription
    const tableName = chatType === "university" ? "group_messages" : "city_messages";
    const nameField = chatType === "university" ? "university_name" : "city_name";
    
    const channel = supabase
      .channel(`${chatType}-${chatName}-changes`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: tableName,
          filter: `${nameField}=eq.${chatName}`,
        },
        (payload: MessagePayload) => {
          // Cast the new message based on chatType to ensure proper typing
          if (chatType === "university") {
            const newMessage = payload.new as GroupMessage;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          } else {
            const newMessage = payload.new as CityMessage;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatType, chatName]);
  
  const sendMessage = async (content: string, senderId: string) => {
    try {
      if (chatType === "university") {
        // Insert into group_messages for university chats
        const { error } = await supabase
          .from("group_messages")
          .insert({
            sender_id: senderId,
            university_name: chatName,
            content: content.trim(),
          });
        
        if (error) throw error;
      } else {
        // Insert into city_messages for city chats
        const { error } = await supabase
          .from("city_messages")
          .insert({
            sender_id: senderId,
            city_name: chatName,
            content: content.trim(),
          });
        
        if (error) throw error;
      }
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error(`Error sending ${chatType} message:`, err);
      return false;
    }
  };
  
  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};
