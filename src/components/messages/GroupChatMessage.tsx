
import { Profile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { MessageReactions } from "./MessageReactions";

interface GroupChatMessageProps {
  content: string;
  createdAt: string;
  senderId: string;
  isCurrentUser: boolean;
  senderProfile?: Profile;
  messageId?: string;
  messageType?: "group" | "city";
  currentUserId?: string;
}

export const GroupChatMessage = ({
  content,
  createdAt,
  senderId,
  isCurrentUser,
  senderProfile,
  messageId,
  messageType = "group",
  currentUserId,
}: GroupChatMessageProps) => {
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a");
  };

  return (
    <div className={`group/msg flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[75%] ${isCurrentUser ? "flex-row-reverse" : ""}`}>
        {!isCurrentUser && (
          <Link to={`/profile/${senderId}`}>
            <Avatar className="h-8 w-8 mr-2 hover:ring-2 hover:ring-primary/30 transition">
              <AvatarImage src={senderProfile?.avatar_url || undefined} />
              <AvatarFallback className="bg-muted">
                {getInitials(senderProfile?.name)}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}
        
        <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
          {!isCurrentUser && (
            <div className="text-xs text-muted-foreground mb-1 ml-1">
              {senderProfile?.name || "Unknown user"}
            </div>
          )}
          
          <div
            className={`rounded-lg px-4 py-2 ${
              isCurrentUser
                ? "bg-erasmatch-blue text-white rounded-tr-none"
                : "bg-muted text-foreground rounded-tl-none"
            }`}
          >
            <div>{content}</div>
            <div
              className={`text-xs mt-1 ${
                isCurrentUser ? "text-blue-100" : "text-muted-foreground"
              }`}
            >
              {formatMessageDate(createdAt)}
            </div>
          </div>

          {messageId && (
            <MessageReactions
              messageId={messageId}
              messageType={messageType}
              currentUserId={currentUserId || null}
              isCurrentUser={isCurrentUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};
