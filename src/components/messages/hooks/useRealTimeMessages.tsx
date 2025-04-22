
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
    if (messages.length > 0) {
      // Filter messages to only include those between current user and partner
      const filteredMessages = messages.filter(
        msg => (msg.sender_id === currentUserId && msg.receiver_id === partnerId) || 
               (msg.sender_id === partnerId && msg.receiver_id === currentUserId)
      );
      
      // Sort messages by creation time (oldest first)
      const sortedMessages = [...filteredMessages].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      setLocalMessages(sortedMessages);
    } else {
      setLocalMessages([]);
    }
  }, [messages, currentUserId, partnerId]);

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
            console.log("Received new message:", newMessage);
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
