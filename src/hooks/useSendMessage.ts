import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { createNotification } from "@/utils/notifications";
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
        user_a: currentUserId,
        user_b: receiverId,
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

      // Fetch sender profile for notification text
      const { data: senderProfile, error: senderError } = await supabase
        .from("profiles")
        .select("name, avatar_url")
        .eq("id", currentUserId)
        .single();

      if (senderError) throw senderError;

      // Send email notification
      const response = await supabase.functions.invoke("send-message-notification", {
        body: {
          senderName: senderProfile?.name || "Someone",
          senderAvatarUrl: senderProfile?.avatar_url || null,
          messageContent: content,
          receiverId,
        },
      });

      if (response.error) {
        console.error("Error sending email notification:", response.error);
      }

      // Create in-app notification
      const senderName = senderProfile?.name || "Someone";
      createNotification({
        userId: receiverId,
        type: "direct_message",
        actorId: currentUserId,
        referenceId: messageData?.id,
        title: "New message",
        body: `${senderName} sent you a message`,
      });

      // Invalidate messages cache so any open Messages page updates
      queryClient.invalidateQueries({ queryKey: ["direct-messages", currentUserId] });
    },
    [currentUserId, queryClient]
  );

  return sendMessage;
}
