
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import GroupChatHeader from "./GroupChatHeader";
import GroupChatMessageList from "./GroupChatMessageList";
import GroupChatInputForm from "./GroupChatInputForm";
import { useGroupMessages } from "@/hooks/useGroupMessages";
import { useGroupParticipants } from "@/hooks/useGroupParticipants";
import { useGroupMessageSender } from "@/hooks/useGroupMessageSender";

type GroupChatViewProps = {
  chatType: "university" | "city";
};

const GroupChatView = ({ chatType }: GroupChatViewProps) => {
  const { id } = useParams<{ id: string }>();
  const { currentUserId } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const groupId = id || "";
  const decodedId = groupId ? decodeURIComponent(groupId) : "";

  // Custom hooks extract the complex logic
  const { messages, loading } = useGroupMessages(chatType, groupId);
  const { participants, allProfiles } = useGroupParticipants(chatType, groupId);
  const { sendMessage, isSending } = useGroupMessageSender(chatType, groupId, currentUserId);

  return (
    <div className="container flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      <GroupChatHeader 
        chatType={chatType}
        groupName={decodedId}
        participants={participants}
      />

      <div className="flex-1 overflow-y-auto p-4">
        <GroupChatMessageList
          messages={messages}
          loading={loading}
          currentUserId={currentUserId || ""}
          allProfiles={allProfiles}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <GroupChatInputForm
        onSendMessage={sendMessage}
        isSending={isSending}
        placeholder={`Message everyone in ${decodedId || (chatType === "university" ? "this university" : "this city")}...`}
      />
    </div>
  );
};

export default GroupChatView;
