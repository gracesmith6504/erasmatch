
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
  return (
    <CommandGroup>
      {universities.map((university) => (
        <CommandItem
          key={university.id}
          value={university.name}
          onSelect={onSelect}
          className="py-3"
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              selectedValue === university.name ? "opacity-100" : "opacity-0"
            )}
          />
          <div className="flex flex-col">
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
