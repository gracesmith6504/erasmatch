
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Profile, GroupMessage } from "@/types";
import { toast } from "sonner";
import { GroupParticipantsInfo } from "./GroupParticipantsInfo";
import { GroupChatMessageList } from "./GroupChatMessageList";
import { GroupChatInput } from "./GroupChatInput";

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
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [participants, setParticipants] = useState<Profile[]>([]);
  
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
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [universityName]);
  
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
      
    } catch (error: any) {
      toast.error("Failed to send message: " + error.message);
      console.error("Error sending group message:", error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Group header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="font-medium text-lg">🎓 {universityName} Chat</h2>
          <GroupParticipantsInfo count={participants.length} />
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
        />
      </div>
    </div>
  );
};
