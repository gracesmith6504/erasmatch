import { useState, useEffect, useRef } from "react";
import { MapPin, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { fetchAll } from "@/lib/fetchAll";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Module-level cache
let citiesCache: string[] | null = null;

function toSortedDistinct(cities: (string | null | undefined)[]): string[] {
  const citySet = new Set<string>();
  for (const c of cities) {
    const trimmed = c?.trim();
    if (trimmed) citySet.add(trimmed);
  }
  return Array.from(citySet).sort((a, b) => a.localeCompare(b));
}

async function fetchDistinctCities(): Promise<string[]> {
  if (citiesCache) return citiesCache;

  try {
    // Server-side distinct over universities + profiles. Still paged because
    // PostgREST's row cap also applies to set-returning RPCs.
    const rows = await fetchAll((from, to) =>
      supabase.rpc("get_distinct_cities").range(from, to)
    );
    citiesCache = toSortedDistinct(rows);
  } catch (err) {
    // Fallback until the get_distinct_cities migration is applied: the old
    // behaviour (profile cities + university cities), paged past the row cap.
    // Not cached, so the RPC is retried next time.
    console.warn("get_distinct_cities RPC failed, using fallback:", err);
    const [profileRows, universityRows] = await Promise.all([
      fetchAll((from, to) =>
        supabase
          .from("profiles")
          .select("id, city")
          .not("city", "is", null)
          .is("deleted_at", null)
          .order("id")
          .range(from, to)
      ),
      fetchAll((from, to) =>
        supabase
          .from("universities")
          .select("id, city")
          .not("city", "is", null)
          .order("id")
          .range(from, to)
      ),
    ]);
    return toSortedDistinct([
      ...profileRows.map((r) => r.city),
      ...universityRows.map((r) => r.city),
    ]);
  }
  return citiesCache;
}

type CityAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  compact?: boolean; // smaller trigger for inline use
};

export function CityAutocomplete({
  value,
  onChange,
  placeholder = "Select or type a city...",
  className,
  compact = false,
}: CityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLoading(true);
    fetchDistinctCities()
      .then(setCities)
      .catch((err) => console.error("Failed to load cities:", err))
      .finally(() => setLoading(false));
  }, []);

  const normalizedSearch = search.trim().toLowerCase();

  const filtered = normalizedSearch
    ? cities.filter((c) => c.toLowerCase().includes(normalizedSearch))
    : cities;

  // Show "Add custom" option if typed value doesn't exactly match any city
  const exactMatch = cities.some(
    (c) => c.toLowerCase() === normalizedSearch
  );
  const showCustomOption =
    normalizedSearch.length > 0 && !exactMatch;

  const handleSelect = (city: string) => {
    onChange(city);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          ref={buttonRef}
          className={cn(
            "w-full justify-between",
            compact && "h-9 text-sm border-dashed",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="flex items-center gap-1.5 truncate">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{value || placeholder}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search cities..."
            value={search}
            onValueChange={setSearch}
            className="bg-background"
          />
          <CommandList className="max-h-[200px]">
            <CommandEmpty>
              {loading ? "Loading..." : "No cities found"}
            </CommandEmpty>
            <CommandGroup>
              {filtered.slice(0, 30).map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={() => handleSelect(city)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === city ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city}
                </CommandItem>
              ))}
              {showCustomOption && (
                <CommandItem
                  value={`custom-${search}`}
                  onSelect={() => handleSelect(search.trim())}
                  className="text-primary"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Add "{search.trim()}"
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function clearCitiesCache() {
  citiesCache = null;
}
