
import { useState, useEffect, useRef } from "react";
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
  onChange: (value: string, isFromApi?: boolean) => void;
  onManualEntry: () => void;
  universities: University[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  popoverRef: React.RefObject<HTMLDivElement>;
  required?: boolean;
  apiFallbackResults?: University[];
  isSearchingApi?: boolean;
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
  apiFallbackResults = [],
  isSearchingApi = false,
}: UniversityDropdownProps) {
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSelect = (universityName: string, isFromApi?: boolean) => {
    onChange(universityName, isFromApi);
    setOpen(false);
  };
  
  // Adjust width on mobile
  useEffect(() => {
    if (open && popoverRef.current) {
      const popoverElement = popoverRef.current;
      const viewportWidth = window.innerWidth;
      
      if (viewportWidth < 640) {
        popoverElement.style.width = `${viewportWidth - 40}px`;
      } else {
        const buttonWidth = buttonRef.current?.offsetWidth;
        if (buttonWidth) {
          popoverElement.style.width = `${buttonWidth}px`;
        }
      }
    }
  }, [open, popoverRef]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [universities]);

  const displayValue = value && value.length > 28 
    ? value.substring(0, 28) + "..." 
    : value || "Select university...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between truncate ${required && !value ? 'border-destructive' : ''}`}
          aria-required={required}
          ref={buttonRef}
        >
          <span className="truncate mr-2">{displayValue}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 flex-shrink-0" />
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
            placeholder="Search by name, city, country..." 
            value={searchQuery}
            onValueChange={onSearchChange}
            className="bg-background"
          />
          <CommandList ref={scrollRef} className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>
              {isLoading ? (
                <p className="py-6 text-center text-sm">Loading...</p>
              ) : (
                <p className="py-6 text-center text-sm">No university found</p>
              )}
            </CommandEmpty>
            <UniversitySearchResults 
              universities={universities} 
              selectedValue={value} 
              onSelect={handleSelect}
              onManualEntry={() => { setOpen(false); onManualEntry(); }}
              searchQuery={searchQuery}
              apiFallbackResults={apiFallbackResults}
              isSearchingApi={isSearchingApi}
            />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
