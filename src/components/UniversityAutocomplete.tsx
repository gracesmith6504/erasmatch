
import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface University {
  name: string;
}

interface UniversityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export function UniversityAutocomplete({ value, onChange }: UniversityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchUniversities = async () => {
      if (!open) return; // Only fetch when dropdown is open
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await supabase
          .from("universities")
          .select("name")
          .ilike("name", `%${searchQuery}%`)
          .limit(10);
        
        if (fetchError) {
          console.error("Error fetching universities:", fetchError);
          setError("Failed to load universities");
          setUniversities([]);
          return;
        }
        
        // Always ensure we have an array, even if empty
        setUniversities(data ? data : []);
      } catch (err) {
        console.error("Error in university fetch:", err);
        setError("An unexpected error occurred");
        setUniversities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversities();
  }, [searchQuery, open]);

  const displayValue = value || "Select university";

  const handleSelectUniversity = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    
    // Reset search when opening
    if (newOpen) {
      setSearchQuery("");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left"
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(
        "w-full p-0",
        isMobile ? "w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)]" : "min-w-[240px]"
      )}>
        <Command>
          <CommandInput 
            placeholder="Search universities..." 
            onValueChange={setSearchQuery}
            value={searchQuery}
          />
          {isLoading ? (
            <div className="py-6 text-center text-sm">Loading universities...</div>
          ) : error ? (
            <div className="py-6 text-center text-sm text-red-500">{error}</div>
          ) : universities.length === 0 ? (
            <div className="py-6 text-center text-sm">No universities found</div>
          ) : (
            <CommandGroup>
              {universities.map((university) => (
                <CommandItem
                  key={university.name}
                  value={university.name}
                  onSelect={handleSelectUniversity}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === university.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {university.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
