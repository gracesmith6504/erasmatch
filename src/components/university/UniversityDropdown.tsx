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
  const scrollRef = useRef<HTMLDivElement>(null); // ✅

  const handleSelect = (universityName: string) => {
    onChange(universityName);
    setOpen(false);
  };
  
  useEffect(() => {
    if (open && popoverRef.current) {
      const popoverElement = popoverRef.current;
      popoverElement.style.width = `${popoverElement.offsetWidth}px`;
    }
  }, [open, popoverRef]);

  // ✅ Reset scroll to top when universities list changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [universities]);

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
            placeholder="Search by name, city, country..." 
            value={searchQuery}
            onValueChange={onSearchChange}
            className="bg-white"
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
            />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
