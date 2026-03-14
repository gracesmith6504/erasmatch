import { useState } from "react";
import { MapPin } from "lucide-react";
import { Profile } from "@/types";
import { ParticipantsDialog } from "./ParticipantsDialog";

interface CityParticipantsInfoProps {
  count: number;
  participants?: Profile[];
}

export const CityParticipantsInfo = ({ count, participants = [] }: CityParticipantsInfoProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="text-sm text-muted-foreground flex items-center cursor-pointer underline decoration-dotted hover:text-foreground transition-colors"
        onClick={() => setOpen(true)}
      >
        <MapPin className="w-3 h-3 mr-1" />
        {count} member{count !== 1 ? "s" : ""} in this city
      </div>
      <ParticipantsDialog
        open={open}
        onOpenChange={setOpen}
        participants={participants}
        title="Members in this city"
      />
    </>
  );
};
