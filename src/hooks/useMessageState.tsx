
import { useState, useMemo } from "react";
import { Message, Profile, ChatThread } from "@/types";

export function useMessageState(
  messages: Message[],
  profiles: Profile[],
  currentUserId: string,
  initialSelectedUser: string | null
) {
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [messagesSent, setMessagesSent] = useState(0); // Counter to trigger thread refresh
  const [refreshKey, setRefreshKey] = useState(0); // Key for forcing component refresh

  // Get the current user's profile
  const currentUserProfile = useMemo(() => {
    return profiles.find(profile => profile.id === currentUserId) || null;
  }, [profiles, currentUserId]);

  // Process messages into threads
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
      const partner = profiles.find(p => p.id === userId);
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
          (partner.name || 'Unknown')
      } : null;
      
      return {
        partner,
        lastMessage
      };
    }).filter(Boolean) as ChatThread[];
  }, [currentUserId, messages, profiles, messagesSent, refreshKey, currentUserProfile]);

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

  return {
    selectedThread,
    setSelectedThread,
    messagesSent,
    setMessagesSent,
    refreshKey,
    setRefreshKey,
    currentUserProfile,
    threads,
    threadMessages
  };
}
