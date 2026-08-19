
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { transformAvatarUrl } from "@/lib/avatar";
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
import { differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks } from "date-fns";

interface MessageHeaderProps {
  isMobile: boolean;
  onBack?: () => void;
  profile?: Profile | null;
  onUserBlocked?: () => void;
}

const getActivityStatus = (lastActiveAt?: string | null): { text: string; isOnline: boolean } => {
  if (!lastActiveAt) return { text: "", isOnline: false };
  const now = new Date();
  const last = new Date(lastActiveAt);
  const mins = differenceInMinutes(now, last);
  if (mins < 5) return { text: "Active now", isOnline: true };
  if (mins < 60) return { text: `Active ${mins}m ago`, isOnline: false };
  const hrs = differenceInHours(now, last);
  if (hrs < 24) return { text: `Active ${hrs}h ago`, isOnline: false };
  const days = differenceInDays(now, last);
  if (days < 7) return { text: `Active ${days}d ago`, isOnline: false };
  const weeks = differenceInWeeks(now, last);
  if (weeks < 4) return { text: `Active ${weeks}w ago`, isOnline: false };
  return { text: "", isOnline: false };
};

export const MessageHeader = ({ isMobile, onBack, profile, onUserBlocked }: MessageHeaderProps) => {
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const { blockUser } = useBlockedUsers();
  const activity = profile ? getActivityStatus(profile.last_active_at) : null;

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
                  <AvatarImage src={transformAvatarUrl(profile.avatar_url)} alt={profile.name || "User"} decoding="async" />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium leading-tight">
                {profile.id ? (
                  <Link to={`/profile/${profile.id}`} className="hover:underline transition-all">
                    {profile.name}
                  </Link>
                ) : (
                  <span>{profile.name}</span>
                )}
              </div>
              {activity?.text && (
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 flex items-center gap-1">
                  {activity.isOnline && (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                  )}
                  {activity.text}
                </p>
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
