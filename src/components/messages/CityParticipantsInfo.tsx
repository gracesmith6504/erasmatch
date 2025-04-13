
import { MapPin } from "lucide-react";

interface CityParticipantsInfoProps {
  count: number;
}

export const CityParticipantsInfo = ({ count }: CityParticipantsInfoProps) => {
  return (
    <div className="text-sm text-gray-500 flex items-center">
      <MapPin className="w-3 h-3 mr-1" />
      {count} member{count !== 1 ? "s" : ""} in this city
    </div>
  );
};
