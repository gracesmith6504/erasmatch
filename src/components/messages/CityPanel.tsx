
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Profile } from "@/types";
import { toast } from "sonner";
import { CityParticipantsInfo } from "./CityParticipantsInfo";
import { CityMessageList } from "./CityMessageList";
import { CityInput } from "./CityInput";
import { useGroupMessages } from "@/hooks/useGroupMessages";

type CityPanelProps = {
  cityName: string;
  currentUserId: string;
  profiles: Profile[];
};

export const CityPanel = ({
  cityName,
  currentUserId,
  profiles,
}: CityPanelProps) => {
  const [isSending, setIsSending] = useState(false);
  
  // Get profiles of students in this city
  const cityParticipants = profiles.filter(
    (profile) => profile.city === cityName
  );
  
  const { messages, isLoading, error, sendMessage } = useGroupMessages({
    chatType: "city",
    chatName: cityName,
  });
  
  // Send city message
  const handleSendMessage = async (message: string) => {
    setIsSending(true);
    try {
      const success = await sendMessage(message, currentUserId);
      
      if (!success) {
        toast.error("Failed to send message");
      }
    } catch (error: any) {
      toast.error(`Failed to send message: ${error.message}`);
      console.error("Error sending city message:", error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* City header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="font-medium text-lg">🏙️ {cityName} Erasmus Chat</h2>
          <CityParticipantsInfo count={cityParticipants.length} />
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <CityMessageList 
          messages={messages}
          profiles={profiles}
          currentUserId={currentUserId}
          isLoading={isLoading}
        />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t">
        <CityInput
          onSendMessage={handleSendMessage}
          isSending={isSending}
        />
      </div>
    </div>
  );
};
