
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
     <div className="flex flex-col w-full max-w-full md:max-w-3xl mx-auto space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === currentUserId;
        return (
          <MessageBubble
            key={message.id}
            content={message.content}
            timestamp={message.created_at}
            isCurrentUser={isCurrentUser}
            isRead={false} // Default to false since 'read' is not in the Message type
          />
        );
      })}
    </div>
  );
};
