
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

    // ✅ Fire email notification in background with improved error handling and logging
    try {
      // First try to get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("❌ Failed to get current user:", userError);
        throw userError;
      }

      if (user) {
        const senderName = user.user_metadata?.name || "Someone";
        const messageContent = content.slice(0, 100);
        
        console.log("🔔 Attempting to send notification email...");
        
        try {
          const result = await supabase.functions.invoke("send-message-email", {
            body: {
              senderName,
              recipientId: receiverId,
              messageContent,
            },
          });
          
          console.log("📡 Email function result:", result);
          
          // If there's an error in the result object itself
          if (result.error) {
            console.error("❌ Function returned an error:", result.error);
            toast({
              title: "Notification Error",
              description: "Unable to send message notification",
              variant: "destructive",
            });
          }
        } catch (err) {
          console.error("❌ Failed to invoke send-message-email function:", err);
          toast({
            title: "Notification Error",
            description: "Unable to send message notification",
            variant: "destructive",
          });
        }
      } else {
        console.warn("⚠️ No user found to send notification");
      }
    } catch (error) {
      console.warn("⚠️ Failed to get user information:", error);
      // Continue execution despite this error
    }

    setMessagesSent(prev => prev + 1);
    setRefreshKey(prev => prev + 1);
    onPromptUsed();
  };
}
