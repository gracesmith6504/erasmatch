
import { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type University = {
  id: number;
  name: string;
  city: string | null;
  country: string | null;
};

type UniversityAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
};

const UniversityAutocomplete = ({ value, onChange }: UniversityAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSearchQuery("");
      fetchUniversities();
    }
  }, [open]);

  const fetchUniversities = async (query = "") => {
    try {
      setIsLoading(true);
      
      let queryBuilder = supabase
        .from("universities")
        .select("id, name, city, country");
      
      if (query) {
        queryBuilder = queryBuilder.ilike("name", `%${query}%`);
      }
      
      const { data, error } = await queryBuilder.limit(10);
      
      if (error) {
        console.error("Error fetching universities:", error);
        setUniversities([]);
        return;
      }
      
      setUniversities(data || []);
    } catch (error) {
      console.error("Error in fetch operation:", error);
      setUniversities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchUniversities(query);
  };

  const handleSelect = (universityName: string) => {
    onChange(universityName);
    setOpen(false);
    setManualEntry(false);
  };

  const handleManualEntry = () => {
    setManualEntry(true);
    setOpen(false);
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Position the popover properly on mobile
  useEffect(() => {
    if (open && popoverRef.current) {
      const popoverElement = popoverRef.current;
      popoverElement.style.width = `${popoverElement.offsetWidth}px`;
    }
  }, [open]);

  return (
    <div className="space-y-2">
      <Label htmlFor="university" className="block text-sm font-medium text-gray-700">
        Destination University
      </Label>
      
      {!manualEntry ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {value || "Select university..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-full p-0" 
            ref={popoverRef}
            align="start"
          >
            <Command>
              <CommandInput 
                placeholder="Search university..." 
                onValueChange={handleSearch}
                value={searchQuery}
              />
              <CommandList>
                <CommandEmpty>
                  {isLoading ? (
                    <p className="py-6 text-center text-sm">Loading...</p>
                  ) : (
                    <div className="py-6 text-center text-sm">
                      <p>No university found</p>
                      <Button 
                        variant="link" 
                        onClick={handleManualEntry}
                        className="mt-2"
                      >
                        University not listed? Tap here to enter manually
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
                      <div>
                        <p>{university.name}</p>
                        {university.city && university.country && (
                          <p className="text-xs text-muted-foreground">
                            {university.city}, {university.country}
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
      ) : (
        <div className="space-y-2">
          <Input
            id="university"
            name="university"
            value={value}
            onChange={handleManualInputChange}
            placeholder="Enter your university name"
            className="w-full"
          />
          <Button 
            variant="link" 
            onClick={() => setManualEntry(false)}
            className="px-0 text-sm"
          >
            Return to university list
          </Button>
        </div>
      )}
    </div>
  );
};

export default UniversityAutocomplete;
