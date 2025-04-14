
import { Message, Profile } from "@/types";
import { MessagesContainer } from "@/components/messages/MessagesContainer";

type MessagesProps = {
  messages: Message[];
  profiles: Profile[];
  currentUserId: string;
  onSendMessage: (receiverId: string, content: string) => void;
};

const Messages = ({ messages, profiles, currentUserId, onSendMessage }: MessagesProps) => {
  return (
    <MessagesContainer
      messages={messages}
      profiles={profiles}
      currentUserId={currentUserId}
      onSendMessage={onSendMessage}
    />
  );
};

export default Messages;
