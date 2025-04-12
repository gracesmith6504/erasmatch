
import { MapPin } from "lucide-react";
import { format } from "date-fns";

type CityListItemProps = {
  cityName: string;
  participantsCount: number;
  lastMessage?: {
    content: string;
    created_at: string;
    sender_name: string;
  } | null;
  isSelected: boolean;
  onClick: () => void;
};

export const CityListItem = ({
  cityName,
  participantsCount,
  lastMessage,
  isSelected,
  onClick,
}: CityListItemProps) => {
  return (
    <button
      className={`w-full bg-white rounded-lg p-4 shadow-sm mb-3 text-left hover:bg-gray-50 ${
        isSelected ? "ring-2 ring-erasmatch-blue" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col">
        <div className="font-medium">🏙️ {cityName} Erasmus Chat</div>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{participantsCount} members</span>
        </div>
        {lastMessage && (
          <div className="mt-1">
            <div className="text-sm text-gray-600 truncate">
              <span className="font-medium">{lastMessage.sender_name}: </span>
              {lastMessage.content}
            </div>
            <div className="text-xs text-gray-400">
              {format(new Date(lastMessage.created_at), "MMM d")}
            </div>
          </div>
        )}
      </div>
    </button>
  );
};
