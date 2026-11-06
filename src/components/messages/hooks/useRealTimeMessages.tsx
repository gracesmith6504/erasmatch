
import { useState, useEffect } from "react";
import { Message } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { uniqueChannelName, appendUniqueById } from "@/lib/realtimeChannel";

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
    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase
        .channel(uniqueChannelName(`direct-messages-${currentUserId}-${partnerId}`))
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
              setLocalMessages(prevMessages => appendUniqueById(prevMessages, newMessage));
              scrollToBottom();
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.warn("Thread realtime subscription failed:", err);
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [currentUserId, partnerId, scrollToBottom]);

  return { localMessages, setLocalMessages };
}
