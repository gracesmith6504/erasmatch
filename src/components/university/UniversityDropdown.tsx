
import { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { University } from "./types";
import { autoAddUniversity } from "./useAutoAddUniversity";

const normalizeString = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

type UniversityDropdownProps = {
  value: string;
  onChange: (value: string, isFromApi?: boolean) => void;
  onManualEntry?: () => void;
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
  const [isAdding, setIsAdding] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSelect = (universityName: string, isFromApi?: boolean) => {
    onChange(universityName, isFromApi);
    setOpen(false);
  };

  // Check if search exactly matches any existing result
  const hasExactMatch = (() => {
    if (!searchQuery.trim()) return true;
    const q = normalizeString(searchQuery);
    const allResults = [...universities, ...apiFallbackResults];
    return allResults.some((u) => normalizeString(u.name) === q);
  })();

  const showAddOption = searchQuery.trim().length > 1 && !hasExactMatch && !isAdding;

  const handleAddCustom = async () => {
    const trimmed = searchQuery.trim();
    if (!trimmed || isAdding) return;
    setIsAdding(true);
    try {
      await autoAddUniversity(trimmed);
      onChange(trimmed);
      setOpen(false);
      onSearchChange("");
    } finally {
      setIsAdding(false);
    }
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

  const hasLocalResults = universities.length > 0;
  const hasApiResults = apiFallbackResults.length > 0;

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
            {/* Local DB results */}
            {hasLocalResults && (
              <CommandGroup heading={hasApiResults ? "From our database" : undefined}>
                {universities.map((university) => (
                  <CommandItem
                    key={university.id}
                    value={`${university.name} ${university.city || ''} ${university.country || ''}`}
                    onSelect={() => handleSelect(university.name, false)}
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
                          {[university.city, university.country].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* API fallback results */}
            {hasApiResults && (
              <CommandGroup heading="Found online">
                {apiFallbackResults.map((university, index) => (
                  <CommandItem
                    key={`api-${index}`}
                    value={`api-${university.name} ${university.country || ''}`}
                    onSelect={() => handleSelect(university.name, true)}
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
                      {university.country && (
                        <p className="text-xs text-muted-foreground">{university.country}</p>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Loading indicator for API search */}
            {isSearchingApi && !hasApiResults && hasLocalResults && (
              <CommandGroup>
                <div className="p-2 text-center">
                  <p className="text-xs text-muted-foreground">Searching global database...</p>
                </div>
              </CommandGroup>
            )}

            {/* Inline add option */}
            {showAddOption && (
              <CommandGroup>
                <CommandItem
                  value={`custom-add-${searchQuery}`}
                  onSelect={handleAddCustom}
                  className="text-primary py-3"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add "{searchQuery.trim()}"
                </CommandItem>
              </CommandGroup>
            )}
            {isAdding && (
              <CommandGroup>
                <CommandItem value="adding-indicator" disabled className="text-muted-foreground py-3">
                  <Plus className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </CommandItem>
              </CommandGroup>
            )}

            {/* No results and not adding */}
            {!hasLocalResults && !hasApiResults && !isSearchingApi && !showAddOption && !isAdding && searchQuery.trim().length > 0 && (
              <CommandGroup>
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">No university found</p>
                </div>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
