
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccommodationFiltersProps {
  cityFilter: string | null;
  setCityFilter: (city: string | null) => void;
  roomTypeFilter: string | null;
  setRoomTypeFilter: (roomType: string | null) => void;
  uniqueCities: string[];
  uniqueRoomTypes: string[];
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const AccommodationFilters: React.FC<AccommodationFiltersProps> = ({
  cityFilter,
  setCityFilter,
  roomTypeFilter,
  setRoomTypeFilter,
  uniqueCities,
  uniqueRoomTypes,
  resetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white shadow-sm rounded-xl p-6 mb-8 border border-gray-100">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Select
            value={cityFilter || "all-cities"}
            onValueChange={(value) =>
              setCityFilter(value === "all-cities" ? null : value)
            }
          >
            <SelectTrigger className="h-12 border-gray-200 focus:border-erasmatch-blue">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="all-cities">All Cities</SelectItem>
              {uniqueCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={roomTypeFilter || "all-room-types"}
            onValueChange={(value) =>
              setRoomTypeFilter(value === "all-room-types" ? null : value)
            }
          >
            <SelectTrigger className="h-12 border-gray-200 focus:border-erasmatch-blue">
              <SelectValue placeholder="All Room Types" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="all-room-types">All Room Types</SelectItem>
              {uniqueRoomTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="button-hover"
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccommodationFilters;
