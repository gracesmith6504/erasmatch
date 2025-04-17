import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { UniversityDropdown } from "./university/UniversityDropdown";
import { ManualUniversityEntry } from "./university/ManualUniversityEntry";
import { useUniversitySearch } from "./university/useUniversitySearch";
import { University } from "./university/types";

type UniversityAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
};

const UniversityAutocomplete = ({ 
  value, 
  onChange,
  label = "University", 
  required = false 
}: UniversityAutocompleteProps) => {
  const [manualEntry, setManualEntry] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { universities: unsortedUniversities, isLoading, searchQuery, handleSearch } = useUniversitySearch();

  const handleManualEntry = () => {
    setManualEntry(true);
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  const universities = getSortedUniversities(unsortedUniversities, label);

  return (
    <div className="space-y-2">
      <Label htmlFor="university" className="block text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {!manualEntry ? (
        <UniversityDropdown
          value={value}
          onChange={onChange}
          onManualEntry={handleManualEntry}
          universities={universities}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          popoverRef={popoverRef}
          required={required}
        />
      ) : (
        <ManualUniversityEntry
          value={value}
          onChange={handleManualInputChange}
          onReturn={() => setManualEntry(false)}
          required={required}
        />
      )}
    </div>
  );
};

const getSortedUniversities = (universities: University[], label: string): University[] => {
  const sorted = [...universities];
  
  if (label !== "Home University") {
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  const irishUniversities = [
    "Trinity College Dublin",
    "University College Dublin",
    "Dublin City University (DCU)",
    "Technological University Dublin (TU Dublin)",
    "University of Galway",
    "University College Cork",
    "University of Limerick",
    "Maynooth University",
    "Queen's University Belfast"
  ];
  
  return sorted.sort((a, b) => {
    const aIsIrish = irishUniversities.indexOf(a.name);
    const bIsIrish = irishUniversities.indexOf(b.name);
    
    if (aIsIrish !== -1 && bIsIrish !== -1) {
      return aIsIrish - bIsIrish;
    }
    
    if (aIsIrish !== -1) return -1;
    
    if (bIsIrish !== -1) return 1;
    
    return a.name.localeCompare(b.name);
  });
};

export default UniversityAutocomplete;
