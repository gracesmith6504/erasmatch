
import { Users } from "lucide-react";

interface GroupParticipantsInfoProps {
  count: number;
}

export const GroupParticipantsInfo = ({ count }: GroupParticipantsInfoProps) => {
  return (
    <div className="text-sm text-gray-500 flex items-center">
      <Users className="w-3 h-3 mr-1" />
      {count} member{count !== 1 ? "s" : ""} in this group
    </div>
  );
};
