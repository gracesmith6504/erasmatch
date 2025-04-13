
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Message, Profile } from "@/types";
import { MessagesContainer } from "@/components/messages/MessagesContainer";

type MessagesProps = {
  messages: Message[];
  profiles: Profile[];
  currentUserId: string;
  onSendMessage: (receiverId: string, content: string) => void;
};

const Messages = ({ messages, profiles, currentUserId, onSendMessage }: MessagesProps) => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  
  return (
    <MessagesContainer
      messages={messages}
      profiles={profiles}
      currentUserId={currentUserId}
      onSendMessage={onSendMessage}
      initialSelectedUserId={userId}
    />
  );
};

export default Messages;
