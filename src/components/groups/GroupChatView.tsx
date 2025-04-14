
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Profile, GroupMessage, CityMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { format } from "date-fns";

type GroupChatViewProps = {
  chatType: "university" | "city";
};

const GroupChatView = ({ chatType }: GroupChatViewProps) => {
  const { id } = useParams<{ id: string }>();
  const { currentUserId } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<(GroupMessage | CityMessage)[]>([]);
  const [newMessage, setNewMessage] = useState("");
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
          // Explicitly cast the data to Profile[] to handle optional fields
          setAllProfiles(data as Profile[]);
          // Filter profiles based on chat type
          const filteredProfiles = data.filter((profile) => {
            return chatType === "university" 
              ? profile.university === decodedId
              : profile.city === decodedId;
          });
          setParticipants(filteredProfiles as Profile[]);
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
          setMessages(data);
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
        (payload) => {
          const newMessage = payload.new as GroupMessage | CityMessage;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [decodedId, chatType]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !decodedId) return;
    
    setIsSending(true);
    
    try {
      const tableName = chatType === "university" ? "group_messages" : "city_messages";
      const columnName = chatType === "university" ? "university_name" : "city_name";
      
      const messageData: any = {
        sender_id: currentUserId,
        content: processMessage(newMessage),
      };
      
      // Add the correct property based on chat type
      messageData[columnName] = decodedId;
      
      const { error } = await supabase
        .from(tableName)
        .insert(messageData);
        
      if (error) throw error;
      
      setNewMessage("");
    } catch (error) {
      console.error(`Error sending message:`, error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  // Process @mentions in messages
  const processMessage = (message: string): string => {
    // Simple implementation - could be expanded to link to profiles or highlight mentions
    return message;
  };

  // Get user profile by id
  const getUserProfile = (userId: string): Profile | undefined => {
    return allProfiles.find(profile => profile.id === userId);
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

  // Format timestamp
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a");
  };

  return (
    <div className="container flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between py-4 px-4 border-b">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/groups")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-lg flex items-center">
              {chatType === "university" ? (
                <>
                  <span className="mr-2">🎓</span>
                  {decodedId || "University Chat"}
                </>
              ) : (
                <>
                  <span className="mr-2">🏙️</span>
                  {decodedId || "City Chat"}
                </>
              )}
            </h1>
            <div className="text-sm text-gray-500 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {participants.length} {participants.length === 1 ? 'participant' : 'participants'}
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate("/groups")}>
          Back to Groups
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-16 w-80" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Users className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-xl font-semibold text-gray-700">No messages yet</h3>
            <p className="text-gray-500 mt-2">
              Be the first to start a conversation in this group!
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender_id === currentUserId;
            const senderProfile = getUserProfile(message.sender_id);
            
            return (
              <div 
                key={message.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[75%] ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                  {!isOwnMessage && (
                    <Link to={`/profile/${message.sender_id}`} className="mr-2">
                      <Avatar className="h-8 w-8 hover:ring-2 hover:ring-blue-300 transition-all">
                        <AvatarImage src={senderProfile?.avatar_url || undefined} />
                        <AvatarFallback className={`bg-${isOwnMessage ? 'blue' : 'gray'}-200`}>
                          {getInitials(senderProfile?.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  )}
                  
                  <div>
                    {!isOwnMessage && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1 ml-1">
                        <span className="font-semibold">{senderProfile?.name || "Unknown"}</span>
                        {senderProfile?.home_university && (
                          <span className="opacity-70">• {senderProfile?.home_university}</span>
                        )}
                      </div>
                    )}
                    
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        isOwnMessage
                          ? "bg-blue-500 text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-900 rounded-tl-none"
                      }`}
                    >
                      <div className="break-words">{message.content}</div>
                      <div
                        className={`text-xs mt-1 ${
                          isOwnMessage ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatMessageTime(message.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
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
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message everyone in ${decodedId || (chatType === "university" ? "this university" : "this city")}...`}
            disabled={isSending}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className={isSending ? "opacity-50" : ""}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GroupChatView;
