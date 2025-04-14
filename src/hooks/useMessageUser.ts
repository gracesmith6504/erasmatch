
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";

export const useMessageUser = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUserId } = useAuth();
  const { messages } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const messageUser = async (receiverId: string) => {
    if (!currentUserId || currentUserId === receiverId) {
      return;
    }

    try {
      setIsProcessing(true);

      // Check if a conversation already exists
      const existingMessages = messages.filter(
        (msg) =>
          (msg.sender_id === currentUserId && msg.receiver_id === receiverId) ||
          (msg.sender_id === receiverId && msg.receiver_id === currentUserId)
      );

      if (existingMessages.length > 0) {
        // Conversation exists, navigate to messages and open this thread
        navigate(`/messages?userId=${receiverId}`);
        return;
      }

      // No conversation exists, but don't create a message yet
      // Just navigate to messages page with this user's conversation open
      navigate(`/messages?userId=${receiverId}`);
    } catch (error) {
      console.error("Error processing message action:", error);
      toast({
        title: "Could not open message thread",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return { messageUser, isProcessing };
};
