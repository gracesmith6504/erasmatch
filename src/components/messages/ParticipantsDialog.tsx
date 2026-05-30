import { useNavigate } from "react-router-dom";
import { Profile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";
import { useMemo } from "react";
import { compareFiltered } from "@/lib/studentOrdering";
import { differenceInDays } from "date-fns";

interface ParticipantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participants: Profile[];
  title: string;
}

export const ParticipantsDialog = ({
  open,
  onOpenChange,
  participants,
  title,
}: ParticipantsDialogProps) => {
  const navigate = useNavigate();

  const sortedParticipants = useMemo(
    () => [...participants].sort(compareFiltered),
    [participants]
  );

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const handleMessage = (profileId: string) => {
    onOpenChange(false);
    navigate(`/messages?user=${profileId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] sm:max-h-96 -mx-1">
          <div className="space-y-2 px-1 pr-2 sm:pr-4">
            {sortedParticipants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-3 rounded-lg border p-2.5 sm:p-3"
              >
                <div className="relative shrink-0">
                  <Avatar className="h-12 w-12 sm:h-11 sm:w-11">
                    {participant.avatar_url && (
                      <AvatarImage
                        src={`${participant.avatar_url}?width=96&height=96&resize=cover&quality=75`}
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <AvatarFallback className="bg-secondary text-foreground text-sm">
                      {getInitials(participant.name)}
                    </AvatarFallback>
                  </Avatar>
                  {participant.last_active_at &&
                    differenceInDays(new Date(), new Date(participant.last_active_at)) <= 21 && (
                      <span
                        className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"
                        aria-label="Active recently"
                      />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">
                    {participant.name || "Unknown"}
                  </p>
                  {participant.home_university && (
                    <p className="text-xs text-muted-foreground truncate">
                      🏠 {participant.home_university}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-9 w-9 sm:h-9 sm:w-auto sm:px-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary"
                  onClick={() => handleMessage(participant.id)}
                  aria-label={`Message ${participant.name || "member"}`}
                >
                  <Mail className="h-4 w-4 sm:mr-1.5" />
                  <span className="hidden sm:inline text-sm font-medium">Message</span>
                </Button>
              </div>
            ))}
            {participants.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No members yet
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
