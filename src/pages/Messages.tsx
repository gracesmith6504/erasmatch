
import { useState, useEffect } from "react";
import { Message, Profile, ChatThread } from "@/types";
import { MessagesContainer } from "@/components/messages/MessagesContainer";
import { useSearchParams } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [initialSelectedUser, setInitialSelectedUser] = useState<string | null>(null);
  const { messages, profiles, handleSendMessage } = useData();
  const { currentUserId } = useAuth();
  
  // Check for a user param in the URL (e.g., from StudentCard navigation)
  useEffect(() => {
    const userParam = searchParams.get('user');
    
    if (userParam) {
      setInitialSelectedUser(userParam);
    }
  }, [searchParams]);

  if (!currentUserId) {
    return null;
  }

  return (
    <MessagesContainer
      messages={messages}
      profiles={profiles}
      currentUserId={currentUserId}
      onSendMessage={handleSendMessage}
      initialSelectedUser={initialSelectedUser}
    />
  );
};

export default Messages;
