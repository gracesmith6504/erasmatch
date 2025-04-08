
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";

type UniversityFiltersProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  uniqueCountries: string[];
  onResetFilters: () => void;
};

const UniversityFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCountry,
  setSelectedCountry,
  uniqueCountries,
  onResetFilters
}: UniversityFiltersProps) => {

  // Determine if any filter is active
  const isAnyFilterActive = searchQuery || selectedCountry !== "all";

  return (
    <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          <Input
            type="text"
            placeholder="Search universities, cities, programs..."
            className="pl-10 h-12 border-gray-200 focus:border-erasmatch-blue transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="relative min-w-[200px]">
          <Select 
            value={selectedCountry} 
            onValueChange={setSelectedCountry}
          >
            <SelectTrigger className="w-full h-12 border-gray-200 focus:border-erasmatch-blue transition-colors">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Select Country" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="all">All Countries</SelectItem>
              {uniqueCountries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline" 
          onClick={onResetFilters}
          className="h-12 sm:w-auto button-hover"
          disabled={!isAnyFilterActive}
        >
          Reset Filters
        </Button>
      </div>
      
      {/* Tag display for active filters */}
      {isAnyFilterActive && (
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
          <div className="text-sm text-gray-500 mr-1">Active filters:</div>
          {searchQuery && (
            <div className="inline-flex items-center text-xs bg-blue-50 text-blue-700 py-1 px-2 rounded-full">
              Search: {searchQuery}
              <button className="ml-1" onClick={() => setSearchQuery("")}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {selectedCountry !== "all" && (
            <div className="inline-flex items-center text-xs bg-purple-50 text-purple-700 py-1 px-2 rounded-full">
              Country: {selectedCountry}
              <button className="ml-1" onClick={() => setSelectedCountry("all")}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UniversityFilters;
