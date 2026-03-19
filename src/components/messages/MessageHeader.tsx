
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/types";
import { Link } from "react-router-dom";
import { ArrowLeft, MoreVertical, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BlockUserDialog } from "@/components/block/BlockUserDialog";
import { useBlockedUsers } from "@/hooks/useBlockedUsers";

interface MessageHeaderProps {
  isMobile: boolean;
  onBack?: () => void;
  profile?: Profile | null;
  onUserBlocked?: () => void;
}

export const MessageHeader = ({ isMobile, onBack, profile, onUserBlocked }: MessageHeaderProps) => {
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const { blockUser } = useBlockedUsers();

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleBlock = async () => {
    if (profile?.id) {
      await blockUser(profile.id);
      onUserBlocked?.();
    }
  };

  const handleBlockAndReport = async (reason: string) => {
    if (profile?.id) {
      await blockUser(profile.id, reason, true);
      onUserBlocked?.();
    }
  };

  return (
    <>
      <div className="sticky top-0 z-30 p-4 border-b bg-background/95 backdrop-blur-sm flex items-center gap-3 w-full">
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
                <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || "User"} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
            <div className="font-medium flex-1">
              {profile.id ? (
                <Link to={`/profile/${profile.id}`} className="hover:underline transition-all">
                  {profile.name}
                </Link>
              ) : (
                <span>{profile.name}</span>
              )}
            </div>
            {profile.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowBlockDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Block User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {profile && (
        <BlockUserDialog
          isOpen={showBlockDialog}
          onOpenChange={setShowBlockDialog}
          userName={profile.name || "this user"}
          onBlock={handleBlock}
          onBlockAndReport={handleBlockAndReport}
        />
      )}
    </>
  );
};
