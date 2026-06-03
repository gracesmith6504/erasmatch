
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
      className={`w-full bg-white rounded-lg p-4 shadow-sm mb-3 text-left hover:bg-gray-50 transition-all ${
        isSelected ? "ring-2 ring-erasmatch-blue border-erasmatch-blue" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white flex items-center justify-center mr-3">
          <MapPin className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-lg">{cityName} Erasmus Chat</div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <span>{participantsCount} members</span>
          </div>
          {lastMessage && (
            <div className="mt-2">
              <div className="text-sm text-gray-600 truncate">
                <span className="font-medium">{lastMessage.sender_name}: </span>
                {lastMessage.content}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {format(new Date(lastMessage.created_at), "MMM d")}
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
