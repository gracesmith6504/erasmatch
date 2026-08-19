import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook that returns a sendMessage function.
 * After sending, it invalidates the direct-messages cache so the
 * Messages page picks up the new message without a global re-fetch.
 */
export function useSendMessage() {
  const { currentUserId } = useAuth();
  const queryClient = useQueryClient();

  const sendMessage = useCallback(
    async (receiverId: string, content: string) => {
      if (!currentUserId) return;

      // Check bidirectional block before sending
      const { data: blocked } = await supabase.rpc("is_blocked", {
        other_user: receiverId,
      });
      if (blocked) {
        throw new Error("Unable to send message to this user.");
      }

      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert({
          sender_id: currentUserId,
          receiver_id: receiverId,
          content,
        })
        .select("id, sender_id, receiver_id, content, created_at")
        .single();

      if (messageError) throw messageError;

      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('direct_message_sent');
      }

      // Send email notification — pass receiverId and messageId; the edge
      // function looks up the sender name server-side from the JWT, and
      // fetches the exact message by ID (verifying the caller is the sender)
      // so nothing in the email can be spoofed.
      const response = await supabase.functions.invoke("send-message-notification", {
        body: { receiverId, messageId: messageData?.id },
      });

      if (response.error) {
        console.error("Error sending email notification:", response.error);
      }

      // In-app notification is created automatically by a database trigger
      // on the messages table (notify_on_direct_message), so no client-side
      // insert is needed here.

      // Invalidate messages cache so any open Messages page updates
      queryClient.invalidateQueries({ queryKey: ["direct-messages", currentUserId] });
    },
    [currentUserId, queryClient]
  );

  return sendMessage;
}
