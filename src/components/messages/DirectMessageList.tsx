
import { Message, Profile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface DirectMessageListProps {
  messages: Message[];
  currentUserId: string;
  formatMessageDate: (dateString: string) => string;
}

export const DirectMessageList = ({
  messages,
  currentUserId,
  formatMessageDate,
}: DirectMessageListProps) => {
  // Get initials for avatar
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No messages yet. Start a conversation!</p>
        </div>
      ) : (
        messages.map((message) => {
          const isCurrentUser = message.sender_id === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  isCurrentUser
                    ? 'bg-erasmatch-blue text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div>{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatMessageDate(message.created_at)}
                </div>
              </div>
            </div>
          );
        })
      )}
    </>
  );
};
