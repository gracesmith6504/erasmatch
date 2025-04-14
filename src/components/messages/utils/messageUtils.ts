
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
  setMessagesSent: (prev: number) => void, 
  setRefreshKey: (prev: number) => void,
  setActiveTab: (tab: "direct" | "groups" | "cities") => void
) {
  return async function handleSendMessage(receiverId: string, content: string) {
    try {
      await onSendMessage(receiverId, content);
      
      // Force a refresh of threads by incrementing the counter
      setMessagesSent(prev => prev + 1);
      
      // Force a full component refresh
      setRefreshKey(prev => prev + 1);
      
      // Make sure we're on the direct messages tab after sending a message
      setActiveTab("direct");
      
      console.log("Message sent, refreshing state");
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
    }
  };
}
