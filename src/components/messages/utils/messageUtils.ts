
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
    await onSendMessage(receiverId, content);

    // ✅ Fire email notification in background with improved error handling
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const senderName = user.user_metadata?.name || "Someone";
        const messageContent = content.slice(0, 100);
        
        try {
          const result = await supabase.functions.invoke("send-message-email", {
            body: {
              senderName,
              recipientId,
              messageContent,
            },
          });
          console.log("📡 Email function result:", result);
        } catch (err) {
          console.error("❌ Failed to invoke send-message-email function:", err);
          toast({
            title: "Notification Error",
            description: "Unable to send message notification",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.warn("Failed to get user information:", error);
      // Continue execution despite this error
    }

    setMessagesSent(prev => prev + 1);
    setRefreshKey(prev => prev + 1);
    onPromptUsed();
  };
}
