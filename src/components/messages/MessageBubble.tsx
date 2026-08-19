import React from 'react';
import { format } from 'date-fns';
import { CheckCheck, Check } from 'lucide-react';
import { MessageReactions } from './MessageReactions';
import { ReactionSummary } from '@/hooks/useReactions';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  isRead?: boolean;
  showTimestamp?: boolean;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
  messageId?: string;
  currentUserId?: string;
  reactions?: ReactionSummary[];
  onToggleReaction?: (emoji: string) => void;
}

/**
 * Connected-bubble border-radius system (iMessage / Instagram pattern).
 * Outer corners stay round (18px → rounded-2xl), the connecting
 * side shrinks to 4px (rounded-*-[4px]) on middle messages.
 *
 * Sent (right-aligned):   connecting corner = top-right / bottom-right
 * Received (left-aligned): connecting corner = top-left  / bottom-left
 */
const getBubbleRadius = (
  isCurrentUser: boolean,
  isFirst: boolean,
  isLast: boolean,
) => {
  if (isCurrentUser) {
    // Sent bubbles — right side connects
    if (isFirst && isLast) return "rounded-2xl"; // solo
    if (isFirst) return "rounded-2xl rounded-br-[4px]"; // first
    if (isLast) return "rounded-2xl rounded-tr-[4px]"; // last
    return "rounded-2xl rounded-tr-[4px] rounded-br-[4px]"; // middle
  }
  // Received bubbles — left side connects
  if (isFirst && isLast) return "rounded-2xl"; // solo
  if (isFirst) return "rounded-2xl rounded-bl-[4px]"; // first
  if (isLast) return "rounded-2xl rounded-tl-[4px]"; // last
  return "rounded-2xl rounded-tl-[4px] rounded-bl-[4px]"; // middle
};

const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  timestamp,
  isCurrentUser,
  isRead = false,
  showTimestamp = true,
  isFirstInGroup = true,
  isLastInGroup = true,
  messageId,
  currentUserId,
  reactions = [],
  onToggleReaction,
}) => {
  const formatMessageTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm");
    } catch {
      return dateString;
    }
  };

  const radius = getBubbleRadius(isCurrentUser, isFirstInGroup, isLastInGroup);

  return (
    <div
      className={cn(
        "group/msg flex",
        isCurrentUser ? "justify-end" : "justify-start",
        isLastInGroup ? "mb-2" : "mb-[3px]",
      )}
    >
      <div className={cn("max-w-[75%] flex flex-col", isCurrentUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "px-3.5 py-2",
            isCurrentUser
              ? "bg-erasmatch-blue text-white"
              : "bg-muted text-foreground",
            radius,
          )}
        >
          <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">{content}</div>
        </div>
        {showTimestamp && (
          <div className={cn("flex items-center gap-1 mt-1 px-1", isCurrentUser ? "justify-end" : "justify-start")}>
            <span className="text-[10px] text-muted-foreground">{formatMessageTime(timestamp)}</span>
            {isCurrentUser && (
              isRead ? (
                <CheckCheck className="h-3 w-3 text-erasmatch-blue" />
              ) : (
                <Check className="h-3 w-3 text-muted-foreground" />
              )
            )}
          </div>
        )}
        {messageId && onToggleReaction && (
          <MessageReactions
            summaries={reactions}
            onToggleReaction={onToggleReaction}
            isCurrentUser={isCurrentUser}
          />
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
