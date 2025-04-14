
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GroupMessage, CityMessage } from "@/types";

type MessageType = GroupMessage | CityMessage;

type UseGroupMessagesProps = {
  chatType: "university" | "city";
  chatName: string;
};

// Define a simpler payload type to prevent deep recursion
type SimplifiedPayload = {
  new: Record<string, any>;
};

export const useGroupMessages = ({ chatType, chatName }: UseGroupMessagesProps) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
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
        (payload: SimplifiedPayload) => {
          // Add the new message to state with proper typing
          const newMessage = payload.new as MessageType;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
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
