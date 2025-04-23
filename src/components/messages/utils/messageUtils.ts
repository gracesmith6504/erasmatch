
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Get initials from a name
 */
export const getInitials = (name: string | null): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Handles prompt selection - reset state
 */
export const handlePromptUsed = (): void => {
  console.log("Prompt was used - will reset state after message is sent");
};

/**
 * Handle sending a message with refresh handling
 */
export function createMessageHandler(
  onSendMessage: (receiverId: string, content: string) => Promise<void>,
  setMessagesSent: React.Dispatch<React.SetStateAction<number>>,
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>,
  onPromptUsed: () => void
) {
  return async (receiverId: string, content: string) => {
    try {
      console.log("Sending message to:", receiverId, "with content:", content);
      
      if (!receiverId) {
        console.error("Error: No receiver ID provided");
        toast.error("Failed to send message: No receiver specified");
        return Promise.reject(new Error("No receiver ID provided"));
      }
      
      if (!content.trim()) {
        console.error("Error: Empty message content");
        toast.error("Cannot send empty message");
        return Promise.reject(new Error("Empty message content"));
      }
      
      // Send the message using the edge function
      await onSendMessage(receiverId, content);
      
      // Log success
      console.log("Message sent successfully to:", receiverId);

      // Update UI state
      setMessagesSent(prev => prev + 1);
      setRefreshKey(prev => prev + 1);
      onPromptUsed();
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error in messageHandler:", error);
      toast.error(`Failed to send message: ${error.message || 'Unknown error'}`);
      throw error;
    }
  };
}
