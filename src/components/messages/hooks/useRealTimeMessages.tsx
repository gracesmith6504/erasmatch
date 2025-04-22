
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
      console.log("Initializing local messages:", messages.length);
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

    console.log("Setting up real-time subscription for messages between", currentUserId, "and", partnerId);

    // Subscribe to new messages between current user and thread partner
    const channel = supabase
      .channel('direct-messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
        }, 
        (payload) => {
          const newMessage = payload.new as Message;
          console.log("Received realtime message:", newMessage);
          
          // Only add the message if it's relevant to this conversation
          if ((newMessage.sender_id === currentUserId && newMessage.receiver_id === partnerId) || 
              (newMessage.sender_id === partnerId && newMessage.receiver_id === currentUserId)) {
            console.log("Adding message to conversation:", newMessage);
            
            // Check if message with the same ID already exists (to avoid duplicates)
            setLocalMessages(prevMessages => {
              const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
              if (messageExists) {
                return prevMessages;
              } else {
                return [...prevMessages, newMessage];
              }
            });
            scrollToBottom();
          }
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [currentUserId, partnerId, scrollToBottom]);

  return { localMessages, setLocalMessages };
}
