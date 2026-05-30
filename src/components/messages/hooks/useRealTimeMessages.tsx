
import { useState, useEffect } from "react";
import { Message } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface UseRealTimeMessagesProps {
  messages: Message[];
  currentUserId: string;
  partnerId: string;
  scrollToBottom: () => void;
}

export function useRealTimeMessages({
  messages,
  currentUserId,
  partnerId,
  scrollToBottom
}: UseRealTimeMessagesProps) {
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  // Initialize local messages from props
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Set up Supabase real-time subscription
  useEffect(() => {
    if (!currentUserId || !partnerId) return;

    // Subscribe to new messages between current user and thread partner
    const channel = supabase
      .channel(`direct-messages-${currentUserId}-${partnerId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `sender_id=eq.${partnerId}`,
        }, 
        (payload) => {
          // Only add the message if it's for the current user
          const newMessage = payload.new as Message;
          if (newMessage.receiver_id === currentUserId) {
            setLocalMessages(prevMessages => [...prevMessages, newMessage]);
            scrollToBottom();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, partnerId, scrollToBottom]);

  return { localMessages, setLocalMessages };
}
