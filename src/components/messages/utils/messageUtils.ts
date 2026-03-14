
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
    // Send the message (DataContext.handleSendMessage already handles email notification)
    await onSendMessage(receiverId, content);

    // Update UI state
    setMessagesSent(prev => prev + 1);
    setRefreshKey(prev => prev + 1);
    onPromptUsed();
  };
}
