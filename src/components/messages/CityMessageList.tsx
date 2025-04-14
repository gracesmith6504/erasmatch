import { Fragment } from "react";
import { Profile, CityMessage } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import MessageBubble from "./MessageBubble";

type CityMessageListProps = {
  messages: any[]; // Using any[] to avoid type issues
  profiles: Profile[];
  currentUserId: string;
  isLoading?: boolean;
};

export const CityMessageList = ({
  messages,
  profiles,
  currentUserId,
  isLoading = false,
}: CityMessageListProps) => {
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
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-4xl mb-3">💬</div>
        <p className="text-gray-500 text-center">
          No messages yet. Be the first to say hello!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const sender = profiles.find((p) => p.id === message.sender_id);
        const isCurrentUser = message.sender_id === currentUserId;
        
        return (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              isCurrentUser ? "flex-row-reverse" : ""
            }`}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={sender?.avatar_url || ""} />
              <AvatarFallback>
                {sender?.name?.substring(0, 2).toUpperCase() || "??"}
              </AvatarFallback>
            </Avatar>

            <div className={`flex flex-col ${isCurrentUser ? "items-end" : ""}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500 font-medium">
                  {sender?.name || "Unknown"} {!isCurrentUser && sender?.home_university && `· ${sender.home_university}`}
                  {!isCurrentUser && !sender?.home_university && sender?.country && `· ${sender.country}`}
                </span>
              </div>

              <MessageBubble 
                isCurrentUser={isCurrentUser} 
                content={message.content} 
                timestamp={message.created_at}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
