
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
      .channel('direct-messages')
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
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          // Update the message in the local state if it exists
          const updatedMessage = payload.new as Message;
          setLocalMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, partnerId, scrollToBottom]);

  return { localMessages, setLocalMessages };
}
