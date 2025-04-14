
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
  const [unreadThreadIds, setUnreadThreadIds] = useState<string[]>([]);

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
      
      const lastMessage = sortedMessages.length > 0 ? sortedMessages[0] : null;
      
      return {
        partner,
        lastMessage
      };
    }).filter(Boolean) as ChatThread[];
  }, [currentUserId, messages, profiles, messagesSent, refreshKey]);

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

  // Function to fetch unread messages
  const fetchUnreadMessages = async () => {
    if (!currentUserId) return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .select("sender_id")
        .eq("receiver_id", currentUserId)
        .eq("read", false);
      
      if (error) {
        console.error("Error fetching unread messages:", error);
        return;
      }

      // Extract unique sender IDs
      const uniqueSenderIds = [...new Set(data?.map(m => m.sender_id) || [])];
      setUnreadThreadIds(uniqueSenderIds);
    } catch (error) {
      console.error("Error in fetchUnreadMessages:", error);
    }
  };

  // Mark thread as read
  const markThreadAsRead = async (threadId: string) => {
    try {
      console.log("Marking thread as read:", threadId);
      
      // First, verify there are unread messages for this thread
      const { data: unreadMessages, error: checkError } = await supabase
        .from("messages")
        .select("id")
        .eq("sender_id", threadId)
        .eq("receiver_id", currentUserId)
        .eq("read", false);
      
      if (checkError) {
        console.error("Error checking unread messages:", checkError);
        return;
      }
      
      // Only update if there are unread messages
      if (unreadMessages && unreadMessages.length > 0) {
        const { error } = await supabase
          .from("messages")
          .update({ read: true })
          .eq("sender_id", threadId)
          .eq("receiver_id", currentUserId);
        
        if (error) {
          console.error("Error marking thread as read:", error);
          return;
        }

        // Update local state
        setUnreadThreadIds(prev => prev.filter(id => id !== threadId));
        
        // Force a refresh of the message list
        setRefreshKey(prev => prev + 1);
        
        console.log("Thread marked as read:", threadId);
      } else {
        console.log("No unread messages found for thread:", threadId);
      }
    } catch (error) {
      console.error("Error marking thread as read:", error);
    }
  };

  // Set up real-time message subscription
  useEffect(() => {
    if (!currentUserId) return;
    
    // Subscribe to new messages sent to the current user
    const channel = supabase
      .channel('messages-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${currentUserId}`
      }, (payload) => {
        console.log('New message received:', payload);
        // Fetch unread messages and trigger refresh
        fetchUnreadMessages();
        setRefreshKey(prev => prev + 1);
      })
      .subscribe();

    // Initial fetch
    fetchUnreadMessages();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // Mark messages as read when a thread is selected
  useEffect(() => {
    if (selectedThread && unreadThreadIds.includes(selectedThread.partner.id)) {
      markThreadAsRead(selectedThread.partner.id);
    }
  }, [selectedThread, unreadThreadIds]);

  return {
    selectedThread,
    setSelectedThread,
    messagesSent,
    setMessagesSent,
    refreshKey,
    setRefreshKey,
    currentUserProfile,
    threads,
    threadMessages,
    unreadThreadIds,
    markThreadAsRead,
    fetchUnreadMessages
  };
}
