
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/types";

interface MessageHeaderProps {
  isMobile: boolean;
  onBack?: () => void;
  profile?: Profile | null;
}

export const MessageHeader = ({ isMobile, onBack, profile }: MessageHeaderProps) => {
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
    <div className="p-4 border-b flex items-center">
      {isMobile && onBack && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="mr-2"
        >
          Back
        </Button>
      )}
      {profile && (
        <>
          <Avatar className="h-8 w-8 mr-3">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="bg-erasmatch-light-accent">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">{profile.name}</div>
        </>
      )}
    </div>
  );
};
