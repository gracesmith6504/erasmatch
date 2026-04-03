
import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { UniversityDropdown } from "./university/UniversityDropdown";
import { useUniversitySearch } from "./university/useUniversitySearch";
import { autoAddUniversity } from "./university/useAutoAddUniversity";

type UniversityAutocompleteProps = {
  value: string;
  onChange: (value: string, isFromApi?: boolean) => void;
  label?: string;
  required?: boolean;
  prioritizeIrish?: boolean;
  onManualSave?: (universityName: string, city: string) => void;
};

const UniversityAutocomplete = ({ 
  value, 
  onChange,
  label = "University", 
  required = false,
  prioritizeIrish = false,
  onManualSave,
}: UniversityAutocompleteProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { universities, apiFallbackResults, isLoading, isSearchingApi, searchQuery, handleSearch } = useUniversitySearch(prioritizeIrish);

  const handleDropdownChange = async (universityName: string, isFromApi?: boolean) => {
    if (isFromApi) {
      await autoAddUniversity(universityName);
    }
    onChange(universityName, isFromApi);
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor="university" className="block text-sm font-medium text-muted-foreground">
          {label}{required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <UniversityDropdown
        value={value}
        onChange={handleDropdownChange}
        universities={universities}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        popoverRef={popoverRef}
        required={required}
        apiFallbackResults={apiFallbackResults}
        isSearchingApi={isSearchingApi}
      />
    </div>
  );
};

export default UniversityAutocomplete;
