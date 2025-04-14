
import { useState } from "react";
import { Profile } from "@/types";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useGroupMessages } from "@/hooks/useGroupMessages";
import { GroupChatMessageList } from "./GroupChatMessageList";
import { GroupChatInput } from "./GroupChatInput";
import { GroupParticipantsInfo } from "./GroupParticipantsInfo";

type GroupChatPanelProps = {
  universityName: string;
  currentUserId: string;
  profiles: Profile[];
};

export const GroupChatPanel = ({
  universityName,
  currentUserId,
  profiles,
}: GroupChatPanelProps) => {
  const [isSending, setIsSending] = useState(false);
  
  // Get profiles of students in this university
  const universityParticipants = profiles.filter(
    (profile) => profile.university === universityName
  );
  
  const { messages, isLoading, error, sendMessage } = useGroupMessages({
    chatType: "university",
    chatName: universityName,
  });
  
  // Send group message
  const handleSendMessage = async (message: string) => {
    setIsSending(true);
    try {
      const success = await sendMessage(message, currentUserId);
      
      if (!success) {
        toast.error("Failed to send message");
      }
    } catch (error: any) {
      toast.error(`Failed to send message: ${error.message}`);
      console.error("Error sending group message:", error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* University header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="font-medium text-lg">🎓 {universityName} Chat</h2>
          <GroupParticipantsInfo count={universityParticipants.length} />
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <GroupChatMessageList 
          messages={messages}
          profiles={profiles}
          currentUserId={currentUserId}
          isLoading={isLoading}
        />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t">
        <GroupChatInput
          onSendMessage={handleSendMessage}
          isSending={isSending}
        />
      </div>
    </div>
  );
};
