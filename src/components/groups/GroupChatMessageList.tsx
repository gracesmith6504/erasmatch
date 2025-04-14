
import { useRef, useEffect } from "react";
import { GroupMessage, CityMessage, Profile } from "@/types";
import EmptyMessageState from "./EmptyMessageState";
import MessageListSkeleton from "./MessageListSkeleton";
import MessageList from "./MessageList";

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
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    effectiveRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, effectiveRef]);

  if (loading) {
    return <MessageListSkeleton />;
  }

  if (messages.length === 0) {
    return <EmptyMessageState />;
  }

  return (
    <MessageList 
      messages={messages}
      currentUserId={currentUserId}
      allProfiles={allProfiles}
      messagesEndRef={effectiveRef}
    />
  );
};

export default GroupChatMessageList;
