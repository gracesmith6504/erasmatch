
import { useState, useEffect } from "react";
import { Message, Profile } from "@/types";
import { MessagesContainer } from "@/components/messages/MessagesContainer";
import { useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

type MessagesProps = {
  messages: Message[];
  profiles: Profile[];
  currentUserId: string;
  onSendMessage: (receiverId: string, content: string) => Promise<void>;
};

const Messages = ({ messages, profiles, currentUserId, onSendMessage }: MessagesProps) => {
  const [searchParams] = useSearchParams();
  const [initialSelectedUser, setInitialSelectedUser] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Check for a user param in the URL (e.g., from StudentCard navigation)
  useEffect(() => {
    const userParam = searchParams.get('user');
    
    if (userParam) {
      console.log("URL parameter 'user' found:", userParam);
      setInitialSelectedUser(userParam);
    } else {
      // Clear the initial selection if no user param exists
      setInitialSelectedUser(null);
    }
  }, [searchParams]);

  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Filter out messages with deleted users
  const activeMessages = messages.filter(message => {
    // Find the profiles for both the sender and receiver
    const senderProfile = profiles.find(p => p.id === message.sender_id);
    const receiverProfile = profiles.find(p => p.id === message.receiver_id);
    
    // Check if either sender or receiver has been deleted
    return !(senderProfile?.deleted_at || receiverProfile?.deleted_at);
  });

  // Wrapper for onSendMessage to ensure proper state updates
  const handleSendMessage = async (receiverId: string, content: string): Promise<void> => {
    try {
      await onSendMessage(receiverId, content);
      return;
    } catch (error) {
      console.error("Error in Messages handleSendMessage:", error);
      throw error;
    }
  };

  // Filter active profiles (not deleted)
  const activeProfiles = profiles.filter(profile => !profile.deleted_at);

  return (
    <div className="h-full overflow-hidden w-full inset-0 pt-16 pb-0 flex flex-col">
      <MessagesContainer
        messages={activeMessages}
        profiles={activeProfiles}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
        initialSelectedUser={initialSelectedUser}
      />
    </div>
  );
};

export default Messages;
