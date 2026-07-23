import { useState, useEffect, useCallback, useMemo } from "react";
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
  reacted: boolean;
};

export function useConversationReactions(
  messageIds: string[],
  messageType: "direct" | "group" | "city",
  currentUserId: string | null
) {
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const fetchReactions = useCallback(async () => {
    if (messageIds.length === 0) return;

    const { data, error } = await supabase
      .from("message_reactions")
      .select("*")
      .in("message_id", messageIds)
      .eq("message_type", messageType);

    if (!error && data) setReactions(data as Reaction[]);
  }, [messageIds.join(","), messageType]);

  useEffect(() => {
    fetchReactions();

    const channel = supabase
      .channel(`reactions-${messageType}-${messageIds[0] ?? "empty"}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "message_reactions",
        },
        () => fetchReactions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchReactions]);

  const summariesByMessage = useMemo(() => {
    const map = new Map<string, ReactionSummary[]>();

    for (const r of reactions) {
      if (!map.has(r.message_id)) map.set(r.message_id, []);
      const summaries = map.get(r.message_id)!;

      const existing = summaries.find((s) => s.emoji === r.emoji);
      if (existing) {
        existing.count++;
        existing.userIds.push(r.user_id);
        if (r.user_id === currentUserId) existing.reacted = true;
      } else {
        summaries.push({
          emoji: r.emoji,
          count: 1,
          userIds: [r.user_id],
          reacted: r.user_id === currentUserId,
        });
      }
    }

    return map;
  }, [reactions, currentUserId]);

  const toggleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!currentUserId) return;

      const existing = reactions.find(
        (r) => r.message_id === messageId && r.emoji === emoji && r.user_id === currentUserId
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
    },
    [currentUserId, reactions, messageType]
  );

  return { summariesByMessage, toggleReaction };
}
