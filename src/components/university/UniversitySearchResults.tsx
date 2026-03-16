
import { Check, PlusCircle } from "lucide-react";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { University } from "./types";

type UniversitySearchResultsProps = {
  universities: University[];
  selectedValue: string;
  onSelect: (universityName: string) => void;
  onManualEntry?: () => void;
  searchQuery?: string;
};

export function UniversitySearchResults({ 
  universities, 
  selectedValue, 
  onSelect,
  onManualEntry,
  searchQuery,
}: UniversitySearchResultsProps) {
  if (universities.length === 0) {
    return (
      <CommandGroup>
        <div className="p-4 text-center space-y-3">
          <p className="text-sm text-muted-foreground">No matching universities found</p>
          {onManualEntry && (
            <button
              type="button"
              onClick={onManualEntry}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors w-full justify-center"
            >
              <PlusCircle className="h-4 w-4" />
              {searchQuery ? `Add "${searchQuery}" manually` : "Enter your university manually"}
            </button>
          )}
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
