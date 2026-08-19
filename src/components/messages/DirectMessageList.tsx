import { Message } from "@/types";
import { ReactionSummary } from "@/hooks/useReactions";
import MessageBubble from "./MessageBubble";
import { isSameDay, isToday, isYesterday, format } from "date-fns";

interface DirectMessageListProps {
  messages: Message[];
  currentUserId: string;
  reactionsByMessage: Map<string, ReactionSummary[]>;
  onToggleReaction: (messageId: string, emoji: string) => void;
}

const formatDateLabel = (date: Date): string => {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, d MMMM");
};

const DateSeparator = ({ date }: { date: Date }) => (
  <div className="flex items-center justify-center my-4 select-none">
    <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 backdrop-blur-sm px-3 py-1 rounded-full">
      {formatDateLabel(date)}
    </span>
  </div>
);

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
        const prevMessage = messages[index - 1];

        const msgDate = new Date(message.created_at);
        const prevDate = prevMessage ? new Date(prevMessage.created_at) : null;

        // Show date separator when day changes or on first message
        const showDateSeparator = !prevDate || !isSameDay(msgDate, prevDate);

        // A date separator resets grouping — treat as a new group start
        const isFirstInGroup =
          showDateSeparator || !prevMessage || prevMessage.sender_id !== message.sender_id;

        const nextDate = nextMessage ? new Date(nextMessage.created_at) : null;
        const nextDayBreak = nextDate ? !isSameDay(msgDate, nextDate) : false;

        const isLastInGroup =
          !nextMessage || nextMessage.sender_id !== message.sender_id || nextDayBreak;

        return (
          <div key={message.id}>
            {showDateSeparator && <DateSeparator date={msgDate} />}
            <MessageBubble
              messageId={message.id}
              currentUserId={currentUserId}
              content={message.content}
              timestamp={message.created_at}
              isCurrentUser={isCurrentUser}
              isRead={message.read_by?.includes(message.receiver_id) ?? false}
              showTimestamp={isLastInGroup}
              isFirstInGroup={isFirstInGroup}
              isLastInGroup={isLastInGroup}
              reactions={reactionsByMessage.get(message.id) ?? []}
              onToggleReaction={(emoji) => onToggleReaction(message.id, emoji)}
            />
          </div>
        );
      })}
    </div>
  );
};
