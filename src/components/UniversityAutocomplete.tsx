
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

interface UniversityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export function UniversityAutocomplete({ value, onChange }: UniversityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [universities, setUniversities] = useState<{ name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchUniversities = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Explicitly tell TypeScript we're accessing "universities" table
        const { data, error } = await supabase
          .from("universities")
          .select("name")
          .ilike("name", `%${searchQuery}%`)
          .limit(10);
        
        if (error) {
          console.error("Error fetching universities:", error);
          setError("Failed to load universities");
          setUniversities([]);
          return;
        }
        
        // Safely handle the response
        setUniversities(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error in university fetch:", err);
        setError("An unexpected error occurred");
        setUniversities([]);
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

  // Render content based on loading/error state
  const renderContent = () => {
    if (isLoading) {
      return <div className="py-6 text-center text-sm">Loading universities...</div>;
    }
    
    if (error) {
      return <div className="py-6 text-center text-sm text-red-500">{error}</div>;
    }
    
    return (
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
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
          />
          {renderContent()}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
