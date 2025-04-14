
import { useRef, useEffect } from "react";
import { GroupMessage, CityMessage, Profile } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import MessageBubble from "./MessageBubble";

type GroupChatMessageListProps = {
  messages: (GroupMessage | CityMessage)[];
  loading: boolean;
  currentUserId: string;
  allProfiles: Profile[];
  messagesEndRef?: React.RefObject<HTMLDivElement>;
};

const GroupChatMessageList = ({
  messages,
  loading,
  currentUserId,
  allProfiles,
  messagesEndRef
}: GroupChatMessageListProps) => {
  const localMessagesEndRef = useRef<HTMLDivElement>(null);
  const effectiveRef = messagesEndRef || localMessagesEndRef;
  
  // Get user profile by id
  const getUserProfile = (userId: string): Profile | undefined => {
    return allProfiles.find(profile => profile.id === userId);
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    effectiveRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, effectiveRef]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-16 w-80" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Users className="h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-xl font-semibold text-gray-700">No messages yet</h3>
        <p className="text-gray-500 mt-2">
          Be the first to start a conversation in this group!
        </p>
      </div>
    );
  }

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
      <div ref={effectiveRef} />
    </div>
  );
};

export default GroupChatMessageList;
