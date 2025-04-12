
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCheck, Check } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  isRead?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  content, 
  timestamp, 
  isCurrentUser,
  isRead = false
}) => {
  const formatMessageTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isCurrentUser 
            ? 'message-bubble-out bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple text-white rounded-tr-none' 
            : 'message-bubble-in bg-gray-100 text-gray-900 rounded-tl-none'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{content}</div>
        <div className={`text-xs mt-1 flex items-center ${isCurrentUser ? 'justify-end text-white/80' : 'text-gray-500'}`}>
          <span>{formatMessageTime(timestamp)}</span>
          {isCurrentUser && (
            <span className="ml-1">
              {isRead ? (
                <CheckCheck className="h-3 w-3 inline" />
              ) : (
                <Check className="h-3 w-3 inline" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
