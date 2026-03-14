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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-96">
          <div className="space-y-2 pr-4">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-10 w-10 shrink-0">
                    {participant.avatar_url && (
                      <AvatarImage src={participant.avatar_url} />
                    )}
                    <AvatarFallback className="bg-secondary text-foreground text-sm">
                      {getInitials(participant.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {participant.name || "Unknown"}
                    </p>
                    {participant.home_university && (
                      <p className="text-xs text-muted-foreground truncate">
                        🏠 {participant.home_university}
                      </p>
                    )}
                    {participant.city && (
                      <p className="text-xs text-muted-foreground truncate">
                        📍 {participant.city}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => handleMessage(participant.id)}
                >
                  <Mail className="h-3.5 w-3.5 mr-1" />
                  Message
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
