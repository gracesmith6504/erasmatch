import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Reaction = {
  id: string;
  message_id: string;
  message_type: "direct" | "group" | "city";
  user_id: string;
  emoji: string;
  created_at: string;
};

export type ReactionSummary = {
  emoji: string;
  count: number;
  userIds: string[];
  reacted: boolean; // whether the current user has reacted with this emoji
};

export function useReactions(messageId: string, messageType: "direct" | "group" | "city", currentUserId: string | null) {
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const fetchReactions = useCallback(async () => {
    const { data, error } = await supabase
      .from("message_reactions")
      .select("*")
      .eq("message_id", messageId)
      .eq("message_type", messageType);

    if (!error && data) setReactions(data as Reaction[]);
  }, [messageId, messageType]);

  useEffect(() => {
    fetchReactions();

    const channel = supabase
      .channel(`reactions-${messageId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reactions",
          filter: `message_id=eq.${messageId}`,
        },
        () => fetchReactions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messageId, fetchReactions]);

  const summaries: ReactionSummary[] = reactions.reduce<ReactionSummary[]>((acc, r) => {
    const existing = acc.find((s) => s.emoji === r.emoji);
    if (existing) {
      existing.count++;
      existing.userIds.push(r.user_id);
      if (r.user_id === currentUserId) existing.reacted = true;
    } else {
      acc.push({
        emoji: r.emoji,
        count: 1,
        userIds: [r.user_id],
        reacted: r.user_id === currentUserId,
      });
    }
    return acc;
  }, []);

  const toggleReaction = async (emoji: string) => {
    if (!currentUserId) return;

    const existing = reactions.find(
      (r) => r.emoji === emoji && r.user_id === currentUserId
    );

    if (existing) {
      await supabase.from("message_reactions").delete().eq("id", existing.id);
    } else {
      await supabase.from("message_reactions").insert({
        message_id: messageId,
        message_type: messageType,
        user_id: currentUserId,
        emoji,
      });
    }
  };

  return { summaries, toggleReaction };
}
