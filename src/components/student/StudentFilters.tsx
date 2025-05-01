
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { School, MapPin, X, User, ChevronDown, ChevronUp, Check } from "lucide-react";
import { PERSONALITY_TAGS } from "@/components/profile/constants";
import { cn } from "@/lib/utils";

interface StudentFiltersProps {
  universityFilter: string;
  setUniversityFilter: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  personalityTagsFilter: string[];
  setPersonalityTagsFilter: (tags: string[]) => void;
  uniqueUniversities: string[];
  uniqueCities: string[];
  universitySearchQuery: string;
  setUniversitySearchQuery: (query: string) => void;
  citySearchQuery: string;
  setCitySearchQuery: (query: string) => void;
  filteredUniversities: string[];
  filteredCities: string[];
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
  universitySearchQuery,
  setUniversitySearchQuery,
  citySearchQuery,
  setCitySearchQuery,
  filteredUniversities,
  filteredCities,
  resetFilters,
}: StudentFiltersProps) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const [universityOpen, setUniversityOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  
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

  // Define the default visible tags
  const defaultVisibleTags = ["looking-to-meet", "weekend-trips", "clubbing"];
  
  // Separate tags into priority (default visible) and others
  const priorityTagsData = PERSONALITY_TAGS.filter(tag => 
    defaultVisibleTags.includes(tag.value)
  );
  
  const otherTagsData = PERSONALITY_TAGS.filter(tag => 
    !defaultVisibleTags.includes(tag.value)
  );

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 mb-8 border border-gray-100">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Popover open={universityOpen} onOpenChange={setUniversityOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={universityOpen}
                className="w-full justify-between h-12 border-gray-200 focus:border-erasmatch-blue"
              >
                <div className="flex items-center">
                  <School className="mr-2 h-4 w-4 text-gray-400" />
                  <span>{universityFilter ? universityFilter : "University"}</span>
                </div>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput 
                  placeholder="Search university..." 
                  value={universitySearchQuery}
                  onValueChange={setUniversitySearchQuery}
                  className="h-10"
                />
                <CommandEmpty>No university found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  <CommandItem
                    key="all-universities"
                    value="all-universities"
                    onSelect={() => {
                      setUniversityFilter("all-universities");
                      setUniversityOpen(false);
                    }}
                    className="py-2"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        universityFilter === "all-universities" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>All Universities</span>
                  </CommandItem>
                  {filteredUniversities.map((uni) => (
                    <CommandItem
                      key={uni}
                      value={uni}
                      onSelect={() => {
                        setUniversityFilter(uni);
                        setUniversityOpen(false);
                      }}
                      className="py-2"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          universityFilter === uni ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {uni}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Popover open={cityOpen} onOpenChange={setCityOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={cityOpen}
                className="w-full justify-between h-12 border-gray-200 focus:border-erasmatch-blue"
              >
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                  <span>{cityFilter ? cityFilter : "City"}</span>
                </div>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput 
                  placeholder="Search city..." 
                  value={citySearchQuery}
                  onValueChange={setCitySearchQuery}
                  className="h-10"
                />
                <CommandEmpty>No city found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  <CommandItem
                    key="all-cities"
                    value="all-cities"
                    onSelect={() => {
                      setCityFilter("all-cities");
                      setCityOpen(false);
                    }}
                    className="py-2"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        cityFilter === "all-cities" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>All Cities</span>
                  </CommandItem>
                  {filteredCities.map((city) => (
                    <CommandItem
                      key={city}
                      value={city}
                      onSelect={() => {
                        setCityFilter(city);
                        setCityOpen(false);
                      }}
                      className="py-2"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          cityFilter === city ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {city}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Personality Tags Filter */}
      <div className="mt-6">
        <div className="flex items-center text-sm font-medium mb-3 text-gray-700">
          <User className="mr-2 h-4 w-4 text-gray-400" />
          <span>Filter by Personality Tags</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Priority tags - always visible */}
          {priorityTagsData.map((tag) => {
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
          
          {/* Other tags - conditionally visible on mobile, always visible on desktop */}
          <div className={`${showAllTags ? 'flex' : 'hidden sm:flex'} flex-wrap gap-2 w-full sm:w-auto`}>
            {otherTagsData.map((tag) => {
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
        
        {/* Toggle button - only visible on mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAllTags(!showAllTags)}
          className="mt-2 text-sm text-blue-600 sm:hidden flex items-center"
        >
          {showAllTags ? (
            <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
          ) : (
            <>View More <ChevronDown className="ml-1 h-4 w-4" /></>
          )}
        </Button>
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
