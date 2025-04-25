
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

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden w-full max-w-full fixed inset-0 pt-16 pb-20 md:pb-0">
      <MessagesContainer
        messages={messages}
        profiles={profiles}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
        initialSelectedUser={initialSelectedUser}
      />
    </div>
  );
};

export default Messages;
