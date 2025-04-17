
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { University } from "./types";
import { UniversitySearchResults } from "./UniversitySearchResults";

type UniversityDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  onManualEntry: () => void;
  universities: University[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  popoverRef: React.RefObject<HTMLDivElement>;
  required?: boolean;
};

export function UniversityDropdown({
  value,
  onChange,
  onManualEntry,
  universities,
  isLoading,
  searchQuery,
  onSearchChange,
  popoverRef,
  required = false,
}: UniversityDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (universityName: string) => {
    onChange(universityName);
    setOpen(false);
  };
  
  // Position the popover properly on mobile
  useEffect(() => {
    if (open && popoverRef.current) {
      const popoverElement = popoverRef.current;
      popoverElement.style.width = `${popoverElement.offsetWidth}px`;
    }
  }, [open, popoverRef]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${required && !value ? 'border-red-300' : ''}`}
          aria-required={required}
        >
          {value || "Select university..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0" 
        ref={popoverRef}
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <Command>
          <CommandInput 
            placeholder="Search by name, city or country..." 
            value={searchQuery}
            onValueChange={onSearchChange}
            className="bg-white"
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>
              {isLoading ? (
                <p className="py-6 text-center text-sm">Loading...</p>
              ) : (
                <div className="py-6 text-center text-sm">
                  <p>No university found</p>
                  <Button 
                    variant="link" 
                    onClick={onManualEntry}
                    className="mt-2"
                  >
                    University not listed? Enter manually
                  </Button>
                </div>
              )}
            </CommandEmpty>
            <UniversitySearchResults 
              universities={universities} 
              selectedValue={value} 
              onSelect={handleSelect} 
            />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
