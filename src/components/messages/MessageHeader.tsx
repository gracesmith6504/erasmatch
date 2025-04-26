
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/types";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface MessageHeaderProps {
  isMobile: boolean;
  onBack?: () => void;
  profile?: Profile | null;
}

export const MessageHeader = ({ isMobile, onBack, profile }: MessageHeaderProps) => {
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
    <div className="p-4 border-b bg-white/95 backdrop-blur-sm flex items-center gap-3 w-full">
      {isMobile && onBack && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="p-2 h-auto"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
      )}
      
      {profile && (
        <div className="flex items-center gap-3 flex-1">
          {profile.id && (
            <Link to={`/profile/${profile.id}`} className="hover:opacity-80 transition-opacity">
              <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || "User"} />
                <AvatarFallback className="bg-erasmatch-light-accent">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
          <div className="font-medium">
            {profile.id ? (
              <Link to={`/profile/${profile.id}`} className="hover:underline transition-all">
                {profile.name}
              </Link>
            ) : (
              <span>{profile.name}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
