
import { useState } from "react";
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
  CommandItem,
} from "@/components/ui/command";
import { University } from "./types";

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between min-h-[40px]",
            required && !value ? "border-red-300" : ""
          )}
          aria-required={required}
        >
          <span className="truncate">
            {value || "Select university..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
        ref={popoverRef}
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <Command className="w-full">
          <CommandInput 
            placeholder="Search by name, city, or country..." 
            value={searchQuery}
            onValueChange={onSearchChange}
            className="w-full"
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
            <CommandGroup>
              {universities.map((university) => (
                <CommandItem
                  key={university.id}
                  value={university.name}
                  onSelect={handleSelect}
                  className="py-3"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === university.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col w-full">
                    <p className="font-medium">{university.name}</p>
                    {(university.city || university.country) && (
                      <p className="text-xs text-muted-foreground">
                        {[university.city, university.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
