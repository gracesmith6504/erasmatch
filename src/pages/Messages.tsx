
import { useState, useEffect } from "react";
import { Message, Profile, ChatThread } from "@/types";
import { MessagesContainer } from "@/components/messages/MessagesContainer";
import { useSearchParams } from "react-router-dom";

type MessagesProps = {
  messages: Message[];
  profiles: Profile[];
  currentUserId: string;
  onSendMessage: (receiverId: string, content: string) => void;
};

const Messages = ({ messages, profiles, currentUserId, onSendMessage }: MessagesProps) => {
  const [searchParams] = useSearchParams();
  const [initialSelectedUser, setInitialSelectedUser] = useState<string | null>(null);
  const [messageKey, setMessageKey] = useState(0); // Add key to force refresh
  
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

  // Wrapper for onSendMessage to ensure proper state updates
  const handleSendMessage = async (receiverId: string, content: string) => {
    try {
      await onSendMessage(receiverId, content);
      // Force a refresh of the Messages component
      setMessageKey(prev => prev + 1);
      return true;
    } catch (error) {
      console.error("Error in Messages handleSendMessage:", error);
      throw error;
    }
  };

  return (
    <MessagesContainer
      key={messageKey} // Force a full re-render when messages are sent
      messages={messages}
      profiles={profiles}
      currentUserId={currentUserId}
      onSendMessage={handleSendMessage}
      initialSelectedUser={initialSelectedUser}
    />
  );
};

export default Messages;
