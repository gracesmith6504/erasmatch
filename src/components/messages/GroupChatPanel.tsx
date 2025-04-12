
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Send, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, GroupMessage } from "@/types";
import { toast } from "sonner";

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
  const [newMessage, setNewMessage] = useState("");
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
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsSending(true);
    try {
      const { error } = await supabase
        .from("group_messages")
        .insert({
          sender_id: currentUserId,
          university_name: universityName,
          content: newMessage.trim(),
        });
      
      if (error) throw error;
      
      setNewMessage("");
    } catch (error: any) {
      toast.error("Failed to send message: " + error.message);
      console.error("Error sending group message:", error);
    } finally {
      setIsSending(false);
    }
  };
  
  // Format message date
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a");
  };
  
  // Get sender profile
  const getSenderProfile = (senderId: string) => {
    return profiles.find((profile) => profile.id === senderId);
  };
  
  // Get initials for avatar
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Group header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="font-medium text-lg">🎓 {universityName} Chat</h2>
          <div className="text-sm text-gray-500 flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {participants.length} member{participants.length !== 1 ? "s" : ""} in this group
          </div>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 mb-2">No messages yet</p>
              <p className="text-sm text-gray-400">
                Be the first to start the conversation!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.sender_id === currentUserId;
            const senderProfile = getSenderProfile(message.sender_id);
            
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[75%] ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={senderProfile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-erasmatch-light-accent">
                        {getInitials(senderProfile?.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div>
                    {!isCurrentUser && (
                      <div className="text-xs text-gray-500 mb-1 ml-1">
                        {senderProfile?.name || "Unknown user"}
                      </div>
                    )}
                    
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        isCurrentUser
                          ? "bg-erasmatch-blue text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-900 rounded-tl-none"
                      }`}
                    >
                      <div>{message.content}</div>
                      <div
                        className={`text-xs mt-1 ${
                          isCurrentUser ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatMessageDate(message.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex space-x-2"
        >
          <Input
            placeholder="Type a message to the group..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || isSending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
