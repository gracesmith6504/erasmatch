
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGroupMessageSender(
  chatType: "university" | "city",
  groupId: string,
  userId: string | null
) {
  const [isSending, setIsSending] = useState(false);
  const decodedId = groupId ? decodeURIComponent(groupId) : "";

  const sendMessage = async (message: string) => {
    if (!message.trim() || !userId || !decodedId) return;
    
    setIsSending(true);
    
    try {
      const tableName = chatType === "university" ? "group_messages" : "city_messages";
      
      if (chatType === "university") {
        const messageData = {
          sender_id: userId,
          content: message,
          university_name: decodedId
        };
        
        const { error } = await supabase
          .from(tableName)
          .insert(messageData);
          
        if (error) throw error;
      } else {
        const messageData = {
          sender_id: userId,
          content: message,
          city_name: decodedId
        };
        
        const { error } = await supabase
          .from(tableName)
          .insert(messageData);
          
        if (error) throw error;
      }
    } catch (error) {
      console.error(`Error sending message:`, error);
      toast.error("Failed to send message");
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  return { sendMessage, isSending };
}
