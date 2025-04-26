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
    <div className="flex flex-col w-full max-w-full md:max-w-4xl lg:max-w-5xl mx-auto space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === currentUserId;
        return (
          <div key={message.id}>
            <MessageBubble
              content={message.content}
              timestamp={message.created_at}
              isCurrentUser={isCurrentUser}
              isRead={false}
            />
          </div>
        );
      })}
    </div>
  );
};
