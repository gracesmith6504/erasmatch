
import { useState, useEffect, useMemo } from "react";
import { Message, Profile, ChatThread } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileMessagesView } from "./MobileMessagesView";
import { DesktopMessagesView } from "./DesktopMessagesView";

interface MessagesContainerProps {
  messages: Message[];
  profiles: Profile[];
  currentUserId: string;
  onSendMessage: (receiverId: string, content: string) => void;
  initialSelectedUserId?: string | null;
}

export const MessagesContainer = ({
  messages,
  profiles,
  currentUserId,
  onSendMessage,
  initialSelectedUserId,
}: MessagesContainerProps) => {
  const isMobile = useIsMobile();
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [activeTab, setActiveTab] = useState<"direct" | "groups" | "cities">("direct");
  const [selectedGroupChat, setSelectedGroupChat] = useState<string | null>(null);
  const [selectedCityChat, setSelectedCityChat] = useState<string | null>(null);

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
  }, [currentUserId, messages, profiles]);

  // Initialize selectedThread based on initialSelectedUserId if provided
  useEffect(() => {
    if (initialSelectedUserId && threads.length > 0 && !selectedThread) {
      const thread = threads.find(t => t.partner.id === initialSelectedUserId);
      if (thread) {
        setSelectedThread(thread);
        setActiveTab("direct");
      }
    } else if (threads.length > 0 && !selectedThread && !isMobile && activeTab === "direct") {
      setSelectedThread(threads[0]);
    }
  }, [threads, selectedThread, isMobile, activeTab, initialSelectedUserId]);

  // Get messages for selected thread
  const threadMessages = useMemo(() => {
    if (!selectedThread) return [];
    
    return messages
      .filter(
        m => (m.sender_id === currentUserId && m.receiver_id === selectedThread.partner.id) ||
             (m.receiver_id === currentUserId && m.sender_id === selectedThread.partner.id)
      )
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [selectedThread, currentUserId, messages]);

  const handleSelectGroupChat = (universityName: string) => {
    setSelectedGroupChat(universityName || null);
    setSelectedCityChat(null);
    setSelectedThread(null);
    if (isMobile && universityName) {
      setActiveTab("groups");
    }
  };

  const handleSelectCityChat = (cityName: string) => {
    setSelectedCityChat(cityName || null);
    setSelectedGroupChat(null);
    setSelectedThread(null);
    if (isMobile && cityName) {
      setActiveTab("cities");
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Show mobile view when no conversation selected on mobile
  if (isMobile && !selectedThread && !selectedGroupChat && !selectedCityChat) {
    return (
      <MobileMessagesView
        threads={threads}
        selectedThread={selectedThread}
        setSelectedThread={setSelectedThread}
        getInitials={getInitials}
        profiles={profiles}
        currentUserProfile={currentUserProfile}
        handleSelectGroupChat={handleSelectGroupChat}
        selectedGroupChat={selectedGroupChat}
        handleSelectCityChat={handleSelectCityChat}
        selectedCityChat={selectedCityChat}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    );
  }

  // Show desktop view or conversation on mobile
  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-128px)] py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      
      <DesktopMessagesView
        threads={threads}
        selectedThread={selectedThread}
        setSelectedThread={setSelectedThread}
        getInitials={getInitials}
        profiles={profiles}
        currentUserProfile={currentUserProfile}
        handleSelectGroupChat={handleSelectGroupChat}
        selectedGroupChat={selectedGroupChat}
        handleSelectCityChat={handleSelectCityChat}
        selectedCityChat={selectedCityChat}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        threadMessages={threadMessages}
        currentUserId={currentUserId}
        isMobile={isMobile}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};
