import { supabase } from "@/integrations/supabase/client";

interface CreateNotificationParams {
  userId: string;
  type: "direct_message" | "profile_view" | "city_join";
  actorId: string;
  referenceId?: string;
  title: string;
  body: string;
}

export async function createNotification({
  userId,
  type,
  actorId,
  referenceId,
  title,
  body,
}: CreateNotificationParams) {
  // Don't notify yourself
  if (userId === actorId) return;

  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    actor_id: actorId,
    reference_id: referenceId || null,
    title,
    body,
  });

  if (error) {
    console.error("Error creating notification:", error);
  }
}
