
import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { UniversityDropdown } from "./university/UniversityDropdown";
import { ManualUniversityEntry } from "./university/ManualUniversityEntry";
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
  const [manualEntry, setManualEntry] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { universities, apiFallbackResults, isLoading, isSearchingApi, searchQuery, handleSearch } = useUniversitySearch(prioritizeIrish);

  const handleManualEntry = () => {
    setManualEntry(true);
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  const handleReturnToDropdown = () => {
    setManualEntry(false);
  };

  const handleDropdownChange = async (universityName: string, isFromApi?: boolean) => {
    if (isFromApi) {
      // Auto-add API result to our DB (without city — user will confirm city separately)
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
      
      {!manualEntry ? (
        <div className="space-y-2">
          <UniversityDropdown
            value={value}
            onChange={handleDropdownChange}
            onManualEntry={handleManualEntry}
            universities={universities}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            popoverRef={popoverRef}
            required={required}
            apiFallbackResults={apiFallbackResults}
            isSearchingApi={isSearchingApi}
          />
          
          <button
            type="button"
            onClick={handleManualEntry}
            className="w-full mt-2 py-2.5 px-4 rounded-lg border-2 border-dashed border-muted-foreground/30 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <span>Can't find your university?</span>
            <span className="font-medium text-primary">Enter it manually</span>
          </button>
        </div>
      ) : (
        <ManualUniversityEntry
          value={value}
          onChange={handleManualInputChange}
          onReturn={handleReturnToDropdown}
          required={required}
          onSave={onManualSave}
        />
      )}
    </div>
  );
};

export default UniversityAutocomplete;
