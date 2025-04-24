
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
    <div className="p-4 border-b bg-white flex items-center gap-3 shadow-sm backdrop-blur-md sticky top-0 z-10">
      {isMobile && onBack && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="p-2 h-auto w-auto rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
      )}
      
      {profile && (
        <div className="flex items-center gap-3 flex-1">
          {profile.id && (
            <Link to={`/profile/${profile.id}`} className="hover:opacity-80 transition-opacity">
              <Avatar className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-erasmatch-blue transition-all">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-erasmatch-blue to-erasmatch-purple text-white font-medium">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
          <div>
            <div className="font-medium">
              {profile.id ? (
                <Link to={`/profile/${profile.id}`} className="hover:underline transition-all hover:text-erasmatch-blue">
                  {profile.name}
                </Link>
              ) : (
                <span>{profile.name}</span>
              )}
            </div>
            {profile.university && (
              <div className="text-xs text-gray-500 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></span>
                {profile.university}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
