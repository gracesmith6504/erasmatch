
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface UniversityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

interface University {
  id: number;
  name: string;
}

const UniversityAutocomplete = ({ value, onChange }: UniversityAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [manualValue, setManualValue] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Load initial value
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Search for universities as user types
  const searchUniversities = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('id, name')
        .ilike('name', `%${query}%`)
        .order('name')
        .limit(10);

      if (error) {
        console.error('Error searching universities:', error);
        setSuggestions([]);
        return;
      }

      // Make sure data is always an array before setting state
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching universities:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce function to limit API calls while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!useManualEntry && inputValue) {
        searchUniversities(inputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, useManualEntry]);

  // Handle selection of a university
  const handleSelect = (universityName: string) => {
    onChange(universityName);
    setInputValue(universityName);
    setOpen(false);
  };

  // Handle manual entry
  const handleManualEntry = () => {
    setUseManualEntry(true);
    setOpen(false);
  };

  const submitManualEntry = () => {
    if (manualValue && manualValue.trim()) {
      onChange(manualValue.trim());
      setInputValue(manualValue.trim());
      setUseManualEntry(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {!useManualEntry ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="flex relative w-full">
              <Input
                placeholder="Search for your university..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onClick={() => setOpen(true)}
                className="w-full pr-10"
                autoComplete="off"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full"
                onClick={() => setOpen(!open)}
              >
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[--radix-popover-trigger-width] p-0" 
            align="start"
            ref={popoverRef}
          >
            <Command>
              <CommandInput 
                placeholder="Search universities..." 
                value={inputValue}
                onValueChange={(value) => {
                  setInputValue(value);
                }}
                className="h-9"
              />
              <CommandEmpty>
                {isLoading ? (
                  <p className="py-6 text-center text-sm">Loading...</p>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-sm mb-2">University not listed?</p>
                    <Button 
                      variant="outline" 
                      onClick={handleManualEntry}
                      className="text-sm"
                    >
                      Tap here to enter manually
                    </Button>
                  </div>
                )}
              </CommandEmpty>
              {suggestions.length > 0 && (
                <CommandGroup>
                  {suggestions.map((university) => (
                    <CommandItem
                      key={university.id}
                      value={university.name}
                      onSelect={() => handleSelect(university.name)}
                      className="py-3"
                    >
                      {university.name}
                      {inputValue === university.name && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </Command>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="space-y-2">
          <Input
            placeholder="Enter your university name"
            value={manualValue}
            onChange={(e) => setManualValue(e.target.value)}
            className="w-full"
          />
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setUseManualEntry(false);
                setManualValue("");
              }}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button 
              onClick={submitManualEntry}
              className="text-sm"
              disabled={!manualValue.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityAutocomplete;
