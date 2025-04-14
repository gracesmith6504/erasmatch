
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Profile, GroupMessage, CityMessage } from "@/types";
import { toast } from "sonner";
import GroupChatHeader from "./GroupChatHeader";
import GroupChatMessageList from "./GroupChatMessageList";
import GroupChatInputForm from "./GroupChatInputForm";

type GroupChatViewProps = {
  chatType: "university" | "city";
};

// Define a simple payload type for real-time updates
type RealtimePayload = {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: string;
  new: Record<string, any>;
  old: Record<string, any>;
  errors: any;
};

const GroupChatView = ({ chatType }: GroupChatViewProps) => {
  const { id } = useParams<{ id: string }>();
  const { currentUserId } = useAuth();
  const [messages, setMessages] = useState<(GroupMessage | CityMessage)[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<Profile[]>([]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const decodedId = id ? decodeURIComponent(id) : "";

  // Fetch all profiles for participant display and message rendering
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*");

        if (error) throw error;
        
        if (data) {
          const profilesData = data as unknown as Profile[];
          setAllProfiles(profilesData);
          
          const filteredProfiles = profilesData.filter((profile) => {
            return chatType === "university" 
              ? profile.university === decodedId
              : profile.city === decodedId;
          });
          
          setParticipants(filteredProfiles);
        }
      } catch (error) {
        console.error(`Error fetching profiles:`, error);
      }
    };

    fetchProfiles();
  }, [decodedId, chatType]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!decodedId) return;
      
      setLoading(true);
      
      try {
        const tableName = chatType === "university" ? "group_messages" : "city_messages";
        const columnName = chatType === "university" ? "university_name" : "city_name";
        
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq(columnName, decodedId)
          .order("created_at", { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          setMessages(data as (GroupMessage | CityMessage)[]);
        }
      } catch (error) {
        console.error(`Error fetching ${chatType} messages:`, error);
        toast.error(`Failed to load messages`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription
    const tableName = chatType === "university" ? "group_messages" : "city_messages";
    const columnName = chatType === "university" ? "university_name" : "city_name";
    
    const channel = supabase
      .channel(`${chatType}-messages-changes`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: tableName,
          filter: `${columnName}=eq.${decodedId}`,
        },
        (payload: RealtimePayload) => {
          if (payload && payload.new) {
            const newData = payload.new;
            
            // Create message with basic properties first
            const newMsg: Partial<GroupMessage | CityMessage> = {
              id: newData.id,
              sender_id: newData.sender_id,
              content: newData.content,
              created_at: newData.created_at
            };
            
            // Add type-specific property
            if (chatType === "university") {
              (newMsg as Partial<GroupMessage>).university_name = newData.university_name;
            } else {
              (newMsg as Partial<CityMessage>).city_name = newData.city_name;
            }
            
            setMessages((prevMessages) => [...prevMessages, newMsg as (GroupMessage | CityMessage)]);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [decodedId, chatType]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !currentUserId || !decodedId) return;
    
    setIsSending(true);
    
    try {
      const tableName = chatType === "university" ? "group_messages" : "city_messages";
      
      if (chatType === "university") {
        const messageData = {
          sender_id: currentUserId,
          content: message,
          university_name: decodedId
        };
        
        const { error } = await supabase
          .from(tableName)
          .insert(messageData);
          
        if (error) throw error;
      } else {
        const messageData = {
          sender_id: currentUserId,
          content: message,
          city_name: decodedId
        };
        
        const { error } = await supabase
          .from(tableName)
          .insert(messageData);
          
        if (error) throw error;
      }
    } catch (error) {
      console.error(`Error sending message:`, error);
      toast.error("Failed to send message");
      throw error;
    } finally {
      setIsSending(false);
    }
  };

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
        onSendMessage={handleSendMessage}
        isSending={isSending}
        placeholder={`Message everyone in ${decodedId || (chatType === "university" ? "this university" : "this city")}...`}
      />
    </div>
  );
};

export default GroupChatView;
