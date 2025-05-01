
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, CityMessage } from "@/types";
import { toast } from "sonner";
import { CityParticipantsInfo } from "./CityParticipantsInfo";
import { CityMessageList } from "./CityMessageList";
import { CityInput } from "./CityInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ShareButton } from "../share/ShareButton";

type CityPanelProps = {
  cityName: string;
  currentUserId: string;
  profiles: Profile[];
  onBack?: () => void;
  isFullScreen?: boolean;
};

export const CityPanel = ({
  cityName,
  currentUserId,
  profiles,
  onBack,
  isFullScreen = false,
}: CityPanelProps) => {
  const [messages, setMessages] = useState<CityMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [participants, setParticipants] = useState<Profile[]>([]);
  const [hasSentMessage, setHasSentMessage] = useState(false);
  
  useEffect(() => {
    const getParticipants = () => {
      const cityStudents = profiles.filter(
        (profile) => profile.city === cityName
      );
      setParticipants(cityStudents);
    };
    
    getParticipants();
  }, [cityName, profiles]);
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("city_messages")
          .select("*")
          .eq("city_name", cityName)
          .order("created_at", { ascending: true });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setMessages(data as CityMessage[]);
          
          const userMessages = data.filter(msg => msg.sender_id === currentUserId);
          setHasSentMessage(userMessages.length > 0);
        }
      } catch (error: any) {
        console.error("Error fetching city messages:", error.message);
      }
    };
    
    fetchMessages();
    
    const channel = supabase
      .channel("city_messages_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "city_messages",
          filter: `city_name=eq.${cityName}`,
        },
        (payload) => {
          const newMessage = payload.new as CityMessage;
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
  }, [cityName, currentUserId]);
  
  const handleSendMessage = async (message: string) => {
    setIsSending(true);
    try {
      const { error } = await supabase
        .from("city_messages")
        .insert({
          sender_id: currentUserId,
          city_name: cityName,
          content: message.trim(),
        });
      
      if (error) throw error;
      setHasSentMessage(true);
      
    } catch (error: any) {
      toast.error("Failed to send message: " + error.message);
      console.error("Error sending city message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestionUsed = () => {
    console.log("Suggestion was used in city chat");
  };
  
  return (
    <div className="flex flex-col h-full w-full overflow-x-hidden">
      <div className="p-3 sm:p-4 border-b flex items-center justify-between bg-white">
        <div className="flex items-center overflow-hidden">
          {isFullScreen && onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack} 
              className="mr-1 sm:mr-2 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-1">Back</span>
            </Button>
          )}
          <div className="truncate">
            <h2 className="font-medium text-base sm:text-lg truncate">📍 {cityName} Chat</h2>
            <CityParticipantsInfo count={participants.length} />
          </div>
        </div>
        
        <ShareButton city={cityName}
                     link={`https://erasmatch.com/city/${encodeURIComponent(cityName)}`}/>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col bg-gray-50">
        <CityMessageList 
          messages={messages}
          profiles={profiles}
          currentUserId={currentUserId}
        />
      </div>
      
      <div className="p-3 sm:p-4 border-t bg-white sticky bottom-0 z-10">
        <CityInput
          onSendMessage={handleSendMessage}
          isSending={isSending}
          cityName={cityName}
          showSuggestions={!hasSentMessage}
          onSuggestionUsed={handleSuggestionUsed}
        />
      </div>
    </div>
  );
};
