
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
 * Handle sending a message with refresh handling and email notifications
 */
export function createMessageHandler(
  onSendMessage: (receiverId: string, content: string) => Promise<void>,
  setMessagesSent: React.Dispatch<React.SetStateAction<number>>,
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>,
  onPromptUsed: () => void
) {
  return async (receiverId: string, content: string) => {
    try {
      // Send the message first
      await onSendMessage(receiverId, content);

      // ✅ Send email notification in background
      console.log("🔔 Sending notification email...");
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Get sender's profile for their display name
      const { data: senderProfile, error: senderError } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', user.id)
        .maybeSingle();

      if (senderError) {
        console.error("Error fetching sender profile:", senderError);
        throw new Error(`Could not fetch sender profile: ${senderError.message}`);
      }

      // Get recipient's profile for their email
      const { data: recipientProfile, error: recipientError } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', receiverId)
        .maybeSingle();

      if (recipientError) {
        console.error("Error fetching recipient profile:", recipientError);
        throw new Error(`Could not fetch recipient profile: ${recipientError.message}`);
      }

      if (!senderProfile || !recipientProfile) {
        throw new Error("Could not find required user profiles");
      }

      if (!recipientProfile.email) {
        throw new Error("Recipient has no email address in their profile");
      }

      // Prepare message preview (truncate if too long)
      const messagePreview = content.length > 100 
        ? `${content.slice(0, 100)}...` 
        : content;
      
      // Call the edge function to send email
      const result = await supabase.functions.invoke("send-message-email", {
        body: {
          senderName: senderProfile.name || user.email || "Someone",
          recipientEmail: recipientProfile.email,
          recipientName: recipientProfile.name || "there",
          messagePreview
        },
      });
      
      if (result.error) {
        console.error("Email notification error:", result.error);
        throw new Error(`Failed to send notification: ${result.error}`);
      }
      
      console.log("📧 Email notification sent successfully");
      
    } catch (error) {
      console.error("❌ Error in message handler:", error);
      toast.error(`Message sent but notification email failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Update UI state
    setMessagesSent(prev => prev + 1);
    setRefreshKey(prev => prev + 1);
    onPromptUsed();
  };
}
