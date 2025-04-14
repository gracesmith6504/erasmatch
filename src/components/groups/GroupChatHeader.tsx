
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/types";

type GroupChatHeaderProps = {
  chatType: "university" | "city";
  groupName: string;
  participants: Profile[];
};

const GroupChatHeader = ({ 
  chatType, 
  groupName, 
  participants 
}: GroupChatHeaderProps) => {
  const navigate = useNavigate();
  
  return (
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
                {groupName || "University Chat"}
              </>
            ) : (
              <>
                <span className="mr-2">🏙️</span>
                {groupName || "City Chat"}
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
  );
};

export default GroupChatHeader;
