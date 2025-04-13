
import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { UniversityDropdown } from "./university/UniversityDropdown";
import { ManualUniversityEntry } from "./university/ManualUniversityEntry";
import { useUniversitySearch } from "./university/useUniversitySearch";

type UniversityAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

const UniversityAutocomplete = ({ 
  value, 
  onChange,
  label = "University" 
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

  return (
    <div className="space-y-2">
      <Label htmlFor="university" className="block text-sm font-medium text-gray-700">
        {label}
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
        />
      ) : (
        <ManualUniversityEntry
          value={value}
          onChange={handleManualInputChange}
          onReturn={() => setManualEntry(false)}
        />
      )}
    </div>
  );
};

export default UniversityAutocomplete;
