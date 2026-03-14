import React from 'react';
import { format } from 'date-fns';
import { CheckCheck, Check } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  isRead?: boolean;
  showTimestamp?: boolean;
  isFirstInGroup?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  content, 
  timestamp, 
  isCurrentUser,
  isRead = false,
  showTimestamp = true,
  isFirstInGroup = true,
}) => {
  const formatMessageTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm");
    } catch {
      return dateString;
    }
  };

  const sentRadius = isFirstInGroup
    ? "rounded-2xl rounded-tr-sm"
    : "rounded-2xl rounded-tr-sm";
  const receivedRadius = isFirstInGroup
    ? "rounded-2xl rounded-tl-sm"
    : "rounded-2xl rounded-tl-sm";

  return (
    <div
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} ${showTimestamp ? 'mb-2' : 'mb-0.5'} animate-fade-in`}
    >
      <div className={`max-w-[70%] flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-3.5 py-2 ${
            isCurrentUser
              ? `bg-erasmatch-blue text-white ${sentRadius}`
              : `bg-muted text-foreground ${receivedRadius}`
          }`}
        >
          <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">{content}</div>
        </div>
        {showTimestamp && (
          <div className={`flex items-center gap-1 mt-1 px-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
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
      </div>
    </div>
  );
};

export default MessageBubble;
