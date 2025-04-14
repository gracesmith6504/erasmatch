
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Profile, GroupMessage } from "@/types";
import { toast } from "sonner";
import { GroupParticipantsInfo } from "./GroupParticipantsInfo";
import { GroupChatMessageList } from "./GroupChatMessageList";
import { GroupChatInput } from "./GroupChatInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type GroupChatPanelProps = {
  universityName: string;
  currentUserId: string;
  profiles: Profile[];
  onBack?: () => void;
  isFullScreen?: boolean;
};

export const GroupChatPanel = ({
  universityName,
  currentUserId,
  profiles,
  onBack,
  isFullScreen = false,
}: GroupChatPanelProps) => {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [participants, setParticipants] = useState<Profile[]>([]);
  const [hasSentMessage, setHasSentMessage] = useState(false);
  
  // Get profiles of students at this university
  useEffect(() => {
    const getParticipants = () => {
      const universityStudents = profiles.filter(
        (profile) => profile.university === universityName
      );
      setParticipants(universityStudents);
    };
    
    getParticipants();
  }, [universityName, profiles]);
  
  // Fetch group messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("group_messages")
          .select("*")
          .eq("university_name", universityName)
          .order("created_at", { ascending: true });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setMessages(data as GroupMessage[]);
          
          // Check if user has sent any messages in this chat
          const userMessages = data.filter(msg => msg.sender_id === currentUserId);
          setHasSentMessage(userMessages.length > 0);
        }
      } catch (error: any) {
        console.error("Error fetching group messages:", error.message);
      }
    };
    
    fetchMessages();
    
    // Subscribe to new messages in real-time
    const channel = supabase
      .channel("group_messages_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
          filter: `university_name=eq.${universityName}`,
        },
        (payload) => {
          const newMessage = payload.new as GroupMessage;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          
          // If this is the current user's message, update the hasSentMessage state
          if (newMessage.sender_id === currentUserId) {
            setHasSentMessage(true);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [universityName, currentUserId]);
  
  // Send group message
  const handleSendMessage = async (message: string) => {
    setIsSending(true);
    try {
      const { error } = await supabase
        .from("group_messages")
        .insert({
          sender_id: currentUserId,
          university_name: universityName,
          content: message.trim(),
        });
      
      if (error) throw error;
      setHasSentMessage(true);
      
    } catch (error: any) {
      toast.error("Failed to send message: " + error.message);
      console.error("Error sending group message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestionUsed = () => {
    console.log("Suggestion was used in university chat");
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Group header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          {isFullScreen && onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack} 
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Groups
            </Button>
          )}
          <div>
            <h2 className="font-medium text-lg">🎓 {universityName} Chat</h2>
            <GroupParticipantsInfo count={participants.length} />
          </div>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <GroupChatMessageList 
          messages={messages}
          profiles={profiles}
          currentUserId={currentUserId}
        />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t">
        <GroupChatInput
          onSendMessage={handleSendMessage}
          isSending={isSending}
          universityName={universityName}
          showSuggestions={!hasSentMessage}
          onSuggestionUsed={handleSuggestionUsed}
        />
      </div>
    </div>
  );
};
