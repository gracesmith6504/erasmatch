
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { School, MapPin, X } from "lucide-react";

interface StudentFiltersProps {
  universityFilter: string;
  setUniversityFilter: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  uniqueUniversities: string[];
  uniqueCities: string[];
  resetFilters: () => void;
}

const StudentFilters = ({
  universityFilter,
  setUniversityFilter,
  cityFilter,
  setCityFilter,
  uniqueUniversities,
  uniqueCities,
  resetFilters,
}: StudentFiltersProps) => {
  // Check if any filter is active
  const isAnyFilterActive = universityFilter || cityFilter;
  
  return (
    <div className="bg-white shadow-sm rounded-xl p-6 mb-8 border border-gray-100">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Select value={universityFilter} onValueChange={setUniversityFilter}>
            <SelectTrigger className="h-12 border-gray-200 focus:border-erasmatch-blue">
              <div className="flex items-center">
                <School className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="University" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="all-universities">All Universities</SelectItem>
              {uniqueUniversities.map((uni) => (
                <SelectItem key={uni} value={uni}>
                  {uni}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="h-12 border-gray-200 focus:border-erasmatch-blue">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="City" />
              </div>
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
      </div>

      {/* Tag display for active filters */}
      {isAnyFilterActive && (
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
          <div className="text-sm text-gray-500 mr-1">Active filters:</div>
          {universityFilter && universityFilter !== "all-universities" && (
            <div className="inline-flex items-center text-xs bg-purple-50 text-purple-700 py-1 px-2 rounded-full">
              University: {universityFilter}
              <button className="ml-1" onClick={() => setUniversityFilter("")}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {cityFilter && cityFilter !== "all-cities" && (
            <div className="inline-flex items-center text-xs bg-green-50 text-green-700 py-1 px-2 rounded-full">
              City: {cityFilter}
              <button className="ml-1" onClick={() => setCityFilter("")}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button 
          variant="outline" 
          onClick={resetFilters} 
          className="button-hover"
          disabled={!isAnyFilterActive}
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  );
};

export default StudentFilters;
