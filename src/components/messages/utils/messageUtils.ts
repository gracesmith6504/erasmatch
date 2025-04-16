
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";

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

    // ✅ Fire email notification in background
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.functions.invoke("send-message-email", {
          body: {
            senderName: user.user_metadata?.name || "Someone",
            recipientId: receiverId,
            messageContent: content.slice(0, 100),
          },
        });
      }
    } catch (error) {
      console.warn("Failed to send email notification:", error);
    }

    setMessagesSent(prev => prev + 1);
    setRefreshKey(prev => prev + 1);
    onPromptUsed();
  };
}
