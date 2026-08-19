
import { useState, useMemo, useEffect } from "react";
import { Message, Profile, ChatThread } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export function useMessageState(
  messages: Message[],
  profiles: Profile[],
  currentUserId: string,
  initialSelectedUser: string | null
) {
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [messagesSent, setMessagesSent] = useState(0); // Counter to trigger thread refresh
  const [refreshKey, setRefreshKey] = useState(0); // Key for forcing component refresh

  // Build a Map<id, Profile> once — all lookups below are O(1)
  const profileMap = useMemo(() => {
    const map = new Map<string, Profile>();
    for (const p of profiles) map.set(p.id, p);
    return map;
  }, [profiles]);

  // Get the current user's profile — O(1) via Map
  const currentUserProfile = useMemo(() => {
    return profileMap.get(currentUserId) ?? null;
  }, [profileMap, currentUserId]);

  // Process messages into threads — O(n) instead of O(n × m)
  const threads = useMemo(() => {
    if (!currentUserId) return [];

    // Get all unique conversation partners
    const userIds = new Set<string>();
    messages.forEach(message => {
      if (message.sender_id === currentUserId) {
        userIds.add(message.receiver_id);
      } else if (message.receiver_id === currentUserId) {
        userIds.add(message.sender_id);
      }
    });

    // Create threads with the last message for each conversation partner
    return Array.from(userIds).map(userId => {
      const partner = profileMap.get(userId); // O(1)
      if (!partner) return null;

      // Find messages between current user and this partner
      const threadMessages = messages.filter(
        m => (m.sender_id === currentUserId && m.receiver_id === userId) ||
             (m.receiver_id === currentUserId && m.sender_id === userId)
      );

      // Sort by date and get the most recent
      const sortedMessages = [...threadMessages].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      const lastMsg = sortedMessages.length > 0 ? sortedMessages[0] : null;

      // Transform Message to the format required by ChatThread
      const lastMessage = lastMsg ? {
        content: lastMsg.content,
        created_at: lastMsg.created_at,
        sender_name: lastMsg.sender_id === currentUserId ?
          (currentUserProfile?.name || 'You') :
          (partner.name || 'Unknown'),
        sender_id: lastMsg.sender_id,
        read_by: lastMsg.read_by
      } : null;

      return {
        partner,
        lastMessage
      };
    }).filter(Boolean) as ChatThread[];
  }, [currentUserId, messages, profileMap, messagesSent, refreshKey, currentUserProfile]);

  // Get messages for selected thread
  const threadMessages = useMemo(() => {
    if (!selectedThread) return [];

    return messages
      .filter(
        m => (m.sender_id === currentUserId && m.receiver_id === selectedThread.partner.id) ||
             (m.receiver_id === currentUserId && m.sender_id === selectedThread.partner.id)
      )
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [selectedThread, currentUserId, messages, messagesSent, refreshKey]);

  // New function to mark messages as read when a thread is selected
  const markThreadMessagesAsRead = async (partnerId: string) => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase.rpc("mark_thread_read", {
        p_partner_id: partnerId,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Modify the effect or add a new effect to handle thread selection
  useEffect(() => {
    if (selectedThread) {
      markThreadMessagesAsRead(selectedThread.partner.id);
    }
  }, [selectedThread, currentUserId]);

  // Modify threads to include unread status
  const enhancedThreads = useMemo(() => {
    return threads.map(thread => ({
      ...thread,
      hasUnreadMessages: thread.lastMessage ?
        (thread.lastMessage.sender_id !== currentUserId &&
         (!thread.lastMessage.read_by ||
          !thread.lastMessage.read_by.includes(currentUserId)))
        : false
    }));
  }, [threads, currentUserId]);

  return {
    selectedThread,
    setSelectedThread,
    messagesSent,
    setMessagesSent,
    refreshKey,
    setRefreshKey,
    currentUserProfile,
    threads: enhancedThreads,
    threadMessages,
    markThreadMessagesAsRead
  };
}
