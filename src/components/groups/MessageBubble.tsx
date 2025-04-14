
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Profile } from "@/types";

type MessageBubbleProps = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  isOwnMessage: boolean;
  senderProfile?: Profile;
};

const MessageBubble = ({ 
  id,
  content, 
  created_at, 
  sender_id, 
  isOwnMessage, 
  senderProfile 
}: MessageBubbleProps) => {
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

  // Format timestamp
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a");
  };

  return (
    <div 
      key={id}
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex max-w-[75%] ${isOwnMessage ? "flex-row-reverse" : ""}`}>
        {!isOwnMessage && (
          <Link to={`/profile/${sender_id}`} className="mr-2">
            <Avatar className="h-8 w-8 hover:ring-2 hover:ring-blue-300 transition-all">
              <AvatarImage src={senderProfile?.avatar_url || undefined} />
              <AvatarFallback className={`bg-${isOwnMessage ? 'blue' : 'gray'}-200`}>
                {getInitials(senderProfile?.name)}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}
        
        <div>
          {!isOwnMessage && (
            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1 ml-1">
              <span className="font-semibold">{senderProfile?.name || "Unknown"}</span>
              {senderProfile?.home_university && (
                <span className="opacity-70">• {senderProfile?.home_university}</span>
              )}
            </div>
          )}
          
          <div
            className={`rounded-lg px-4 py-2 ${
              isOwnMessage
                ? "bg-blue-500 text-white rounded-tr-none"
                : "bg-gray-100 text-gray-900 rounded-tl-none"
            }`}
          >
            <div className="break-words">{content}</div>
            <div
              className={`text-xs mt-1 ${
                isOwnMessage ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {formatMessageTime(created_at)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
