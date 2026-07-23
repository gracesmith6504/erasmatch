import { Message } from "@/types";
import { ReactionSummary } from "@/hooks/useReactions";
import MessageBubble from "./MessageBubble";

interface DirectMessageListProps {
  messages: Message[];
  currentUserId: string;
  reactionsByMessage: Map<string, ReactionSummary[]>;
  onToggleReaction: (messageId: string, emoji: string) => void;
}

export const DirectMessageList = ({
  messages,
  currentUserId,
  reactionsByMessage,
  onToggleReaction,
}: DirectMessageListProps) => {
  return (
    <div className="flex flex-col w-full max-w-full md:max-w-4xl lg:max-w-5xl mx-auto py-2 px-1">
      {messages.map((message, index) => {
        const isCurrentUser = message.sender_id === currentUserId;
        const nextMessage = messages[index + 1];
        const isLastInGroup =
          !nextMessage || nextMessage.sender_id !== message.sender_id;
        const prevMessage = messages[index - 1];
        const isFirstInGroup =
          !prevMessage || prevMessage.sender_id !== message.sender_id;

        return (
          <MessageBubble
            key={message.id}
            messageId={message.id}
            currentUserId={currentUserId}
            content={message.content}
            timestamp={message.created_at}
            isCurrentUser={isCurrentUser}
            isRead={message.read_by?.includes(currentUserId) ?? false}
            showTimestamp={isLastInGroup}
            isFirstInGroup={isFirstInGroup}
            reactions={reactionsByMessage.get(message.id) ?? []}
            onToggleReaction={(emoji) => onToggleReaction(message.id, emoji)}
          />
        );
      })}
    </div>
  );
};
