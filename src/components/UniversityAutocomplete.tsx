
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

interface UniversityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export function UniversityAutocomplete({ value, onChange }: UniversityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [universities, setUniversities] = useState<{ name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUniversities = async () => {
      setIsLoading(true);
      try {
        let query = supabase.from("universities").select("name");
        
        if (searchQuery) {
          query = query.ilike("name", `%${searchQuery}%`);
        }
        
        const { data, error } = await query.limit(10);
        
        if (error) {
          console.error("Error fetching universities:", error);
          return;
        }
        
        setUniversities(data || []);
      } catch (error) {
        console.error("Error in university fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversities();
  }, [searchQuery]);

  const displayValue = value || "Select university";

  const handleSelectUniversity = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search universities..." 
            onValueChange={setSearchQuery}
          />
          {isLoading ? (
            <div className="py-6 text-center text-sm">Loading universities...</div>
          ) : (
            <>
              <CommandEmpty>No university found.</CommandEmpty>
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
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
