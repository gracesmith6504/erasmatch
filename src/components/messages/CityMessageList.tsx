
import { CityMessage, Profile } from "@/types";
import { ReactionSummary } from "@/hooks/useReactions";
import { GroupChatMessage } from "./GroupChatMessage";

interface CityMessageListProps {
  messages: CityMessage[];
  profiles: Profile[];
  currentUserId: string;
  reactionsByMessage: Map<string, ReactionSummary[]>;
  onToggleReaction: (messageId: string, emoji: string) => void;
}

export const CityMessageList = ({
  messages,
  profiles,
  currentUserId,
  reactionsByMessage,
  onToggleReaction,
}: CityMessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No messages yet</p>
          <p className="text-sm text-gray-400">
            Be the first to start the conversation in your city!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === currentUserId;
        const senderProfile = profiles.find((profile) => profile.id === message.sender_id);

        return (
          <GroupChatMessage
            key={message.id}
            messageId={message.id}
            messageType="city"
            currentUserId={currentUserId}
            content={message.content}
            createdAt={message.created_at}
            senderId={message.sender_id}
            isCurrentUser={isCurrentUser}
            senderProfile={senderProfile}
            reactions={reactionsByMessage.get(message.id) ?? []}
            onToggleReaction={(emoji) => onToggleReaction(message.id, emoji)}
          />
        );
      })}
    </div>
  );
};
