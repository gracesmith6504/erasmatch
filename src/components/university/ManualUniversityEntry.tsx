
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeftCircle } from "lucide-react";
import { autoAddUniversity } from "./useAutoAddUniversity";
import { CityAutocomplete } from "@/components/CityAutocomplete";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type ManualUniversityEntryProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReturn: () => void;
  required?: boolean;
  city?: string;
  onCityChange?: (city: string) => void;
  onSave?: (universityName: string, city: string) => void;
};

export function ManualUniversityEntry({ 
  value, 
  onChange, 
  onReturn,
  required,
  city: externalCity,
  onCityChange,
  onSave,
}: ManualUniversityEntryProps) {
  const [internalCity, setInternalCity] = useState("");
  const cityValue = externalCity ?? internalCity;
  const setCityValue = onCityChange ?? setInternalCity;

  const handleSave = async () => {
    if (value.trim()) {
      await autoAddUniversity(value, cityValue);
      onSave?.(value.trim(), cityValue.trim());
    }
    onReturn();
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          id="university"
          name="university"
          value={value}
          onChange={onChange}
          placeholder="Enter your university name"
          className="w-full"
          required={required}
          autoFocus
        />
      </div>
      
      <CityAutocomplete
        value={cityValue}
        onChange={setCityValue}
        placeholder="City (e.g. Barcelona, Milan)"
        compact
      />

      <div className="flex gap-2">
        <Button 
          type="button"
          className="shrink-0 bg-primary hover:bg-primary/90"
          onClick={handleSave}
          disabled={!value}
        >
          Save
        </Button>
        <Button 
          variant="ghost" 
          onClick={onReturn}
          className="px-0 text-sm flex gap-1 items-center text-muted-foreground hover:text-foreground"
          type="button"
        >
          <ArrowLeftCircle className="h-4 w-4" />
          Return to list
        </Button>
      </div>
    </div>
  );
}
