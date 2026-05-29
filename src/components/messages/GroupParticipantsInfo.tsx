import { useState } from "react";
import { Users } from "lucide-react";
import { Profile } from "@/types";
import { ParticipantsDialog } from "./ParticipantsDialog";

interface GroupParticipantsInfoProps {
  count: number;
  participants?: Profile[];
}

export const GroupParticipantsInfo = ({ count, participants = [] }: GroupParticipantsInfoProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="text-sm text-muted-foreground flex items-center cursor-pointer underline decoration-dotted hover:text-foreground transition-colors"
        onClick={() => setOpen(true)}
      >
        <Users className="w-3 h-3 mr-1" />
        {count} member{count !== 1 ? "s" : ""} in this group
      </div>
      <ParticipantsDialog
        open={open}
        onOpenChange={setOpen}
        participants={participants}
        title="Members in this group"
      />
    </>
  );
};
