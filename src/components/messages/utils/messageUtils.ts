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
    // Send the message first
    await onSendMessage(receiverId, content);

    // ✅ Fire email notification in background
    try {
      console.log("🔔 Attempting to send notification email...");
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Extract sender name from user metadata or fallback to email
        const senderName = user.user_metadata?.name || user.email || "Someone";
        
        // Prepare message content (truncate if too long)
        const messageContent = content.slice(0, 100) + (content.length > 100 ? "..." : "");
        
        // Call the edge function
        const result = await supabase.functions.invoke("send-message-email", {
          body: {
            senderName,
            recipientId: receiverId,
            messageContent,
          },
        });
        
        console.log("📡 Email function result:", result);
      }
    } catch (error) {
      console.error("❌ Function returned an error:", error);
      toast.error("Failed to send notification email");
    }

    // Update UI state
    setMessagesSent(prev => prev + 1);
    setRefreshKey(prev => prev + 1);
    onPromptUsed();
  };
}
