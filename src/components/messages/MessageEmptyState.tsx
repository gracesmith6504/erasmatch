
import React from 'react';

const MessageEmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-gray-500">No messages yet. Start a conversation!</p>
    </div>
  );
};

export default MessageEmptyState;
