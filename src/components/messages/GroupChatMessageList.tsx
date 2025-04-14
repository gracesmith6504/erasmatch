
import { GroupMessage, Profile } from "@/types";
import { GroupChatMessage } from "./GroupChatMessage";
import { Skeleton } from "@/components/ui/skeleton";

interface GroupChatMessageListProps {
  messages: GroupMessage[];
  profiles: Profile[];
  currentUserId: string;
  isLoading?: boolean;
}

export const GroupChatMessageList = ({
  messages,
  profiles,
  currentUserId,
  isLoading = false,
}: GroupChatMessageListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-10 w-[250px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No messages yet</p>
          <p className="text-sm text-gray-400">
            Be the first to start the conversation!
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
            content={message.content}
            createdAt={message.created_at}
            senderId={message.sender_id}
            isCurrentUser={isCurrentUser}
            senderProfile={senderProfile}
          />
        );
      })}
    </div>
  );
};
