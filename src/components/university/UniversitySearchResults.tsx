
import { Check } from "lucide-react";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { University } from "./types";

type UniversitySearchResultsProps = {
  universities: University[];
  selectedValue: string;
  onSelect: (universityName: string) => void;
};

export function UniversitySearchResults({ 
  universities, 
  selectedValue, 
  onSelect 
}: UniversitySearchResultsProps) {
  if (universities.length === 0) {
    return (
      <CommandGroup>
        <div className="p-2 text-sm text-center text-gray-500">
          No matching universities found
        </div>
      </CommandGroup>
    );
  }
  
  return (
    <CommandGroup>
      {universities.map((university) => (
        <CommandItem
          key={university.id}
          value={`${university.name} ${university.city || ''} ${university.country || ''}`}
          onSelect={() => onSelect(university.name)}
          className="py-3"
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              selectedValue === university.name ? "opacity-100" : "opacity-0"
            )}
          />
          <div className="flex flex-col w-full">
            <p className="font-medium">{university.name}</p>
            {(university.city || university.country) && (
              <p className="text-xs text-muted-foreground">
                {[
                  university.city, 
                  university.country
                ].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
