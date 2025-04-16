
import { Message } from "@/types";
import MessageBubble from "./MessageBubble";

interface DirectMessageListProps {
  messages: Message[];
  currentUserId: string;
}

export const DirectMessageList = ({
  messages,
  currentUserId,
}: DirectMessageListProps) => {
  return (
    <>
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === currentUserId;
        return (
          <MessageBubble
            key={message.id}
            content={message.content}
            timestamp={message.created_at}
            isCurrentUser={isCurrentUser}
            isRead={!!message.read}
          />
        );
      })}
    </>
  );
};
