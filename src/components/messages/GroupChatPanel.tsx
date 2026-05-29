
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, GroupMessage } from "@/types";
import { toast } from "sonner";
import { GroupParticipantsInfo } from "./GroupParticipantsInfo";
import { GroupChatMessageList } from "./GroupChatMessageList";
import { GroupChatInput } from "./GroupChatInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ShareButton } from "../share/ShareButton";
import { useUniversityResolver } from "@/hooks/useUniversityResolver";

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
  const { resolver, ready: resolverReady } = useUniversityResolver();

  // Canonicalise the chat identifier so reads include historical aliases and
  // writes go to the canonical name.
  const canonicalName = resolverReady ? resolver.resolveToCanonical(universityName) : universityName;

  useEffect(() => {
    const getParticipants = () => {
      const universityStudents = profiles.filter(
        (profile) => resolver.resolveToCanonical(profile.university || "") === canonicalName
      );
      setParticipants(universityStudents);
    };

    getParticipants();
  }, [canonicalName, profiles, resolver]);

  useEffect(() => {
    if (!resolverReady) return;
    const allNames = resolver.getAllNamesFor(canonicalName);

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("group_messages")
          .select("*")
          .in("university_name", allNames)
          .order("created_at", { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          setMessages(data as GroupMessage[]);

          const userMessages = data.filter(msg => msg.sender_id === currentUserId);
          setHasSentMessage(userMessages.length > 0);
        }
      } catch (error: any) {
        console.error("Error fetching group messages:", error.message);
      }
    };

    fetchMessages();

    // Realtime subscribes to the canonical name only; new messages are always
    // written under the canonical name (see handleSendMessage below), so this
    // is sufficient. Historical messages under old names are loaded by the
    // initial fetch above.
    const channel = supabase
      .channel("group_messages_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
          filter: `university_name=eq.${canonicalName}`,
        },
        (payload) => {
          const newMessage = payload.new as GroupMessage;
          setMessages((prevMessages) => [...prevMessages, newMessage]);

          if (newMessage.sender_id === currentUserId) {
            setHasSentMessage(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [canonicalName, currentUserId, resolverReady, resolver]);

  const handleSendMessage = async (message: string) => {
    setIsSending(true);
    try {
      const { error } = await supabase
        .from("group_messages")
        .insert({
          sender_id: currentUserId,
          university_name: canonicalName,
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
      <div className="p-4 border-b flex items-center justify-between bg-white">
        <div className="flex items-center">
          {isFullScreen && onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack} 
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          <div>
            <h2 className="font-medium text-lg">🎓 {canonicalName} Chat</h2>
            <GroupParticipantsInfo count={participants.length} participants={participants} />
          </div>
        </div>

        <ShareButton city={canonicalName}
                     link={`https://erasmatch.com`}/>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col bg-gray-50">
        <GroupChatMessageList 
          messages={messages}
          profiles={profiles}
          currentUserId={currentUserId}
        />
      </div>
      
      <div className="p-4 border-t bg-white sticky bottom-0 z-10">
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
