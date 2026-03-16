
import { Check, PlusCircle, Globe } from "lucide-react";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { University } from "./types";

type UniversitySearchResultsProps = {
  universities: University[];
  selectedValue: string;
  onSelect: (universityName: string, isFromApi?: boolean) => void;
  onManualEntry?: () => void;
  searchQuery?: string;
  apiFallbackResults?: University[];
  isSearchingApi?: boolean;
};

export function UniversitySearchResults({ 
  universities, 
  selectedValue, 
  onSelect,
  onManualEntry,
  searchQuery,
  apiFallbackResults = [],
  isSearchingApi = false,
}: UniversitySearchResultsProps) {
  const hasLocalResults = universities.length > 0;
  const hasApiResults = apiFallbackResults.length > 0;

  if (!hasLocalResults && !hasApiResults) {
    return (
      <CommandGroup>
        <div className="p-4 text-center space-y-3">
          {isSearchingApi ? (
            <p className="text-sm text-muted-foreground">Searching global database...</p>
          ) : (
            <>
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
            </>
          )}
        </div>
      </CommandGroup>
    );
  }
  
  return (
    <>
      {/* Local DB results */}
      {hasLocalResults && (
        <CommandGroup heading={hasApiResults ? "From our database" : undefined}>
          {universities.map((university) => (
            <CommandItem
              key={university.id}
              value={`${university.name} ${university.city || ''} ${university.country || ''}`}
              onSelect={() => onSelect(university.name, false)}
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
              onSelect={() => onSelect(university.name, true)}
              className="py-3"
            >
              <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
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
    </>
  );
}
