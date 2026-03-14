import React, { useState, useRef, useEffect } from "react";
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
import { School, MapPin, X, User, ChevronDown, ChevronUp, Search, Plane } from "lucide-react";
import { PERSONALITY_TAGS } from "@/components/profile/constants";
import { format } from "date-fns";

interface StudentFiltersProps {
  universityFilter: string;
  setUniversityFilter: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  personalityTagsFilter: string[];
  setPersonalityTagsFilter: (tags: string[]) => void;
  arrivalMonthFilter: string;
  setArrivalMonthFilter: (value: string) => void;
  uniqueUniversities: string[];
  uniqueCities: string[];
  uniqueArrivalMonths: string[];
  resetFilters: () => void;
}

const StudentFilters = ({
  universityFilter,
  setUniversityFilter,
  cityFilter,
  setCityFilter,
  personalityTagsFilter,
  setPersonalityTagsFilter,
  arrivalMonthFilter,
  setArrivalMonthFilter,
  uniqueUniversities,
  uniqueCities,
  uniqueArrivalMonths,
  resetFilters,
}: StudentFiltersProps) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const [uniSearch, setUniSearch] = useState("");
  const [uniDropdownOpen, setUniDropdownOpen] = useState(false);
  const uniRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (uniRef.current && !uniRef.current.contains(e.target as Node)) {
        setUniDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredUniversities = uniqueUniversities.filter((uni) =>
    uni.toLowerCase().includes(uniSearch.toLowerCase())
  );

  const formatMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return format(date, "MMMM yyyy");
  };

  const isAnyFilterActive = universityFilter || cityFilter || personalityTagsFilter.length > 0 || (arrivalMonthFilter && arrivalMonthFilter !== "all-months");
  
  const handleTagToggle = (tagValue: string) => {
    if (personalityTagsFilter.includes(tagValue)) {
      setPersonalityTagsFilter(personalityTagsFilter.filter(tag => tag !== tagValue));
    } else {
      setPersonalityTagsFilter([...personalityTagsFilter, tagValue]);
    }
  };

  const getTagColor = (tag: string) => {
    const colors = [
      "bg-erasmatch-blue/10 text-erasmatch-blue",
      "bg-erasmatch-green/10 text-erasmatch-green",
      "bg-erasmatch-purple/10 text-erasmatch-purple",
      "bg-erasmatch-yellow/10 text-erasmatch-yellow",
      "bg-erasmatch-coral/10 text-erasmatch-coral",
      "bg-erasmatch-blue/10 text-erasmatch-blue",
      "bg-erasmatch-orange/10 text-erasmatch-orange",
      "bg-erasmatch-green/10 text-erasmatch-green",
    ];
    const index = tag.length % colors.length;
    return colors[index];
  };

  const defaultVisibleTags = ["looking-to-meet", "weekend-trips", "clubbing"];
  const priorityTagsData = PERSONALITY_TAGS.filter(tag => defaultVisibleTags.includes(tag.value));
  const otherTagsData = PERSONALITY_TAGS.filter(tag => !defaultVisibleTags.includes(tag.value));

  return (
    <div className="bg-card shadow-soft rounded-2xl p-6 mb-8 border border-border">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Searchable University Filter */}
        <div ref={uniRef} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              className="h-12 pl-9 pr-9 border-border focus:border-erasmatch-green"
              placeholder="Search university..."
              value={universityFilter && !uniDropdownOpen ? universityFilter : uniSearch}
              onChange={(e) => {
                setUniSearch(e.target.value);
                setUniDropdownOpen(true);
                if (!e.target.value) setUniversityFilter("");
              }}
              onFocus={() => {
                setUniDropdownOpen(true);
                if (universityFilter) setUniSearch(universityFilter);
              }}
            />
            {universityFilter && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setUniversityFilter("");
                  setUniSearch("");
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {uniDropdownOpen && (
            <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div
                className="px-4 py-2 text-sm cursor-pointer hover:bg-accent transition-colors text-muted-foreground"
                onClick={() => {
                  setUniversityFilter("");
                  setUniSearch("");
                  setUniDropdownOpen(false);
                }}
              >
                All Universities
              </div>
              {filteredUniversities.map((uni) => (
                <div
                  key={uni}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-accent transition-colors text-foreground"
                  onClick={() => {
                    setUniversityFilter(uni);
                    setUniSearch("");
                    setUniDropdownOpen(false);
                  }}
                >
                  {uni}
                </div>
              ))}
              {filteredUniversities.length === 0 && (
                <div className="px-4 py-2 text-sm text-muted-foreground">No results</div>
              )}
            </div>
          )}
        </div>

        <div>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="h-12 border-border focus:border-erasmatch-green">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="City" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="all-cities">All Cities</SelectItem>
              {uniqueCities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Arrival Month Filter */}
        <div>
          <Select value={arrivalMonthFilter} onValueChange={setArrivalMonthFilter}>
            <SelectTrigger className="h-12 border-border focus:border-erasmatch-green">
              <div className="flex items-center">
                <Plane className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Arrival month" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="all-months">All Arrival Months</SelectItem>
              {uniqueArrivalMonths.map((month) => (
                <SelectItem key={month} value={month}>{formatMonth(month)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Personality Tags Filter */}
      <div className="mt-6">
        <div className="flex items-center text-sm font-medium mb-3 text-foreground">
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Filter by Personality Tags</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {priorityTagsData.map((tag) => {
            const isSelected = personalityTagsFilter.includes(tag.value);
            return (
              <Badge
                key={tag.value}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  isSelected ? getTagColor(tag.value) : "hover:bg-secondary"
                }`}
                onClick={() => handleTagToggle(tag.value)}
              >
                {tag.icon} {tag.label}
                {isSelected && <X className="h-3 w-3 ml-1" />}
              </Badge>
            );
          })}
          
          <div className={`${showAllTags ? 'flex' : 'hidden sm:flex'} flex-wrap gap-2 w-full sm:w-auto`}>
            {otherTagsData.map((tag) => {
              const isSelected = personalityTagsFilter.includes(tag.value);
              return (
                <Badge
                  key={tag.value}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isSelected ? getTagColor(tag.value) : "hover:bg-secondary"
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
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAllTags(!showAllTags)}
          className="mt-2 text-sm text-erasmatch-green sm:hidden flex items-center"
        >
          {showAllTags ? (
            <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
          ) : (
            <>View More <ChevronDown className="ml-1 h-4 w-4" /></>
          )}
        </Button>
      </div>

      {isAnyFilterActive && (
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border">
          <div className="text-sm text-muted-foreground mr-1">Active filters:</div>
          {universityFilter && universityFilter !== "all-universities" && (
            <div className="inline-flex items-center text-xs bg-erasmatch-purple/10 text-erasmatch-purple py-1 px-2 rounded-full">
              University: {universityFilter}
              <button className="ml-1" onClick={() => setUniversityFilter("")}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {cityFilter && cityFilter !== "all-cities" && (
            <div className="inline-flex items-center text-xs bg-erasmatch-green/10 text-erasmatch-green py-1 px-2 rounded-full">
              City: {cityFilter}
              <button className="ml-1" onClick={() => setCityFilter("")}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {arrivalMonthFilter && arrivalMonthFilter !== "all-months" && (
            <div className="inline-flex items-center text-xs bg-erasmatch-coral/10 text-erasmatch-coral py-1 px-2 rounded-full">
              Arriving: {formatMonth(arrivalMonthFilter)}
              <button className="ml-1" onClick={() => setArrivalMonthFilter("")}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {personalityTagsFilter.length > 0 && (
            <div className="inline-flex items-center text-xs bg-erasmatch-blue/10 text-erasmatch-blue py-1 px-2 rounded-full">
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
          className="border-border hover:bg-secondary"
          disabled={!isAnyFilterActive}
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  );
};

export default StudentFilters;