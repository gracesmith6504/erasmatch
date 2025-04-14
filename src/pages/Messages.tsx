
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
  
  // Check for a user param in the URL (e.g., from StudentCard navigation)
  useEffect(() => {
    const userParam = searchParams.get('user');
    
    if (userParam) {
      setInitialSelectedUser(userParam);
    }
  }, [searchParams]);

  return (
    <MessagesContainer
      messages={messages}
      profiles={profiles}
      currentUserId={currentUserId}
      onSendMessage={onSendMessage}
      initialSelectedUser={initialSelectedUser}
    />
  );
};

export default Messages;
