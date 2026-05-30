
import React from 'react';

interface TypingIndicatorProps {
  username: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ username }) => {
  return (
    <div className="flex items-center text-gray-500 pl-2 mb-2">
      <div className="typing-indicator">
        <span className="typing-indicator-dot"></span>
        <span className="typing-indicator-dot"></span>
        <span className="typing-indicator-dot"></span>
      </div>
      <span className="text-xs ml-2">{username} is typing...</span>
    </div>
  );
};

export default TypingIndicator;
