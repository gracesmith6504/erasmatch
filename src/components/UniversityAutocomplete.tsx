
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
  const { universities, isLoading, searchQuery, handleSearch } = useUniversitySearch();

  const handleManualEntry = () => {
    setManualEntry(true);
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  console.log("UniversityAutocomplete rendering with", universities.length, "universities");
  
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

export default UniversityAutocomplete;
