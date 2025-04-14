
import { GroupMessage, CityMessage, Profile } from "@/types";
import MessageBubble from "./MessageBubble";

type MessageListProps = {
  messages: (GroupMessage | CityMessage)[];
  currentUserId: string;
  allProfiles: Profile[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
};

const MessageList = ({ 
  messages, 
  currentUserId, 
  allProfiles,
  messagesEndRef 
}: MessageListProps) => {
  // Get user profile by id
  const getUserProfile = (userId: string): Profile | undefined => {
    return allProfiles.find(profile => profile.id === userId);
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.sender_id === currentUserId;
        const senderProfile = getUserProfile(message.sender_id);
        
        return (
          <MessageBubble
            key={message.id}
            id={message.id}
            content={message.content}
            created_at={message.created_at}
            sender_id={message.sender_id}
            isOwnMessage={isOwnMessage}
            senderProfile={senderProfile}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
