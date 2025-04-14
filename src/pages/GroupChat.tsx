
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { GroupChatPanel } from "@/components/messages/GroupChatPanel";
import { CityPanel } from "@/components/messages/CityPanel";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatType = "university" | "city";

const GroupChat = () => {
  const { type, name } = useParams<{ type: string; name: string }>();
  const { currentUserId } = useAuth();
  const { profiles } = useData();
  const navigate = useNavigate();
  
  const [chatType, setChatType] = useState<ChatType>("university");
  const [chatName, setChatName] = useState<string>("");
  
  useEffect(() => {
    if (type === "university" || type === "city") {
      setChatType(type);
    }
    
    if (name) {
      setChatName(decodeURIComponent(name));
    }
  }, [type, name]);
  
  if (!currentUserId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg text-gray-600 mb-4">
          Please log in to join the group chat.
        </p>
        <Button onClick={() => navigate("/auth")}>Log In</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-5xl h-[calc(100vh-7rem)] flex flex-col">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center" 
        onClick={() => navigate("/groups")}
      >
        <ArrowLeft className="mr-2" size={18} />
        Back to Groups
      </Button>
      
      <div className="flex-1 overflow-hidden border rounded-xl shadow-md">
        {chatType === "university" ? (
          <GroupChatPanel 
            universityName={chatName}
            currentUserId={currentUserId}
            profiles={profiles}
          />
        ) : (
          <CityPanel 
            cityName={chatName}
            currentUserId={currentUserId}
            profiles={profiles}
          />
        )}
      </div>
    </div>
  );
};

export default GroupChat;
