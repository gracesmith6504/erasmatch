
import { Profile } from "@/types";

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
  setActiveTab: (tab: any) => void
) {
  return async function handleSendMessage(receiverId: string, content: string): Promise<void> {
    try {
      await onSendMessage(receiverId, content);
      
      // Force a refresh of threads by incrementing the counter
      setMessagesSent((prev) => prev + 1);
      
      // Force a full component refresh
      setRefreshKey((prev) => prev + 1);
      
      console.log("Message sent, refreshing state");
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      throw error;
    }
  };
}
