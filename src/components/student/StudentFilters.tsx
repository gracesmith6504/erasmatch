
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { School, MapPin, X, User } from "lucide-react";
import { PERSONALITY_TAGS } from "@/components/profile/constants";

interface StudentFiltersProps {
  universityFilter: string;
  setUniversityFilter: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  personalityTagsFilter: string[];
  setPersonalityTagsFilter: (tags: string[]) => void;
  uniqueUniversities: string[];
  uniqueCities: string[];
  resetFilters: () => void;
}

const StudentFilters = ({
  universityFilter,
  setUniversityFilter,
  cityFilter,
  setCityFilter,
  personalityTagsFilter,
  setPersonalityTagsFilter,
  uniqueUniversities,
  uniqueCities,
  resetFilters,
}: StudentFiltersProps) => {
  // Check if any filter is active
  const isAnyFilterActive = universityFilter || cityFilter || personalityTagsFilter.length > 0;
  
  const handleTagToggle = (tagValue: string) => {
    if (personalityTagsFilter.includes(tagValue)) {
      // Remove tag if it's already selected
      setPersonalityTagsFilter(personalityTagsFilter.filter(tag => tag !== tagValue));
    } else {
      // Add tag if it's not already selected
      setPersonalityTagsFilter([...personalityTagsFilter, tagValue]);
    }
  };

  // Generate a tag color based on the tag name for consistent coloring
  const getTagColor = (tag: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-yellow-100 text-yellow-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-orange-100 text-orange-800",
      "bg-teal-100 text-teal-800",
    ];
    
    // Use the tag string to pick a consistent color
    const index = tag.length % colors.length;
    return colors[index];
  };

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

      {/* Personality Tags Filter */}
      <div className="mt-6">
        <div className="flex items-center text-sm font-medium mb-3 text-gray-700">
          <User className="mr-2 h-4 w-4 text-gray-400" />
          <span>Filter by Personality Tags</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {PERSONALITY_TAGS.map((tag) => {
            const isSelected = personalityTagsFilter.includes(tag.value);
            return (
              <Badge
                key={tag.value}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  isSelected ? getTagColor(tag.value) : "hover:bg-gray-100"
                }`}
                onClick={() => handleTagToggle(tag.value)}
              >
                {tag.icon} {tag.label}
                {isSelected && <X className="h-3 w-3 ml-1" />}
              </Badge>
            );
          })}
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
          {personalityTagsFilter.length > 0 && (
            <div className="inline-flex items-center text-xs bg-blue-50 text-blue-700 py-1 px-2 rounded-full">
              {personalityTagsFilter.length} personality tag{personalityTagsFilter.length > 1 ? 's' : ''}
              <button className="ml-1" onClick={() => setPersonalityTagsFilter([])}>
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
