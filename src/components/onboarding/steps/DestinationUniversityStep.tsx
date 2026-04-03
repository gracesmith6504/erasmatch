
import { useState, useMemo, useEffect } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, School, Check, ChevronsUpDown, Plus } from "lucide-react";
import { CityAutocomplete } from "@/components/CityAutocomplete";
import { supabase } from "@/integrations/supabase/client";
import { useUniversitiesCache } from "@/hooks/useUniversitiesCache";
import { autoAddUniversity } from "@/components/university/useAutoAddUniversity";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type AliasEntry = { alias: string; university_id: number };

const normalizeString = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

type DestinationUniversityStepProps = {
  initialValue: string;
  initialCity?: string;
  onNext: () => void;
  onBack: () => void;
  onUpdateProfile: (data: any) => Promise<boolean>;
};

export const DestinationUniversityStep = ({
  initialValue,
  initialCity = "",
  onNext,
  onBack,
  onUpdateProfile,
}: DestinationUniversityStepProps) => {
  const [city, setCity] = useState<string>(initialCity);
  const [university, setUniversity] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uniOpen, setUniOpen] = useState(false);
  const [uniSearch, setUniSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { universities: allUniversities, loading: unisLoading } = useUniversitiesCache();
  const [aliases, setAliases] = useState<AliasEntry[]>([]);

  // Load aliases once
  useEffect(() => {
    supabase.from("university_aliases").select("alias, university_id").then(({ data }) => {
      setAliases((data as AliasEntry[]) || []);
    });
  }, []);

  // Filter universities by selected city
  const filteredUniversities = useMemo(() => {
    if (!city) return [];
    const cityLower = city.toLowerCase();
    return allUniversities.filter(
      (u) => u.city?.toLowerCase() === cityLower
    );
  }, [city, allUniversities]);

  // Further filter by search query inside dropdown (with alias support)
  const searchedUniversities = useMemo(() => {
    if (!uniSearch.trim()) return filteredUniversities;
    const q = normalizeString(uniSearch);
    
    // Find university IDs that match via aliases
    const aliasMatchIds = new Set<number>();
    for (const entry of aliases) {
      const normalizedAlias = normalizeString(entry.alias);
      if (normalizedAlias.includes(q) || q.includes(normalizedAlias)) {
        aliasMatchIds.add(entry.university_id);
      }
    }
    
    return filteredUniversities.filter((u) =>
      normalizeString(u.name).includes(q) || aliasMatchIds.has(u.id)
    );
  }, [filteredUniversities, uniSearch, aliases]);

  // Check if the search query exactly matches an existing result
  const hasExactMatch = useMemo(() => {
    if (!uniSearch.trim()) return true;
    const q = normalizeString(uniSearch);
    return filteredUniversities.some((u) => normalizeString(u.name) === q);
  }, [filteredUniversities, uniSearch]);

  const showAddOption = uniSearch.trim().length > 1 && !hasExactMatch && !isAdding;

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setUniversity("");
  };

  const handleSelectUniversity = (name: string) => {
    setUniversity(name);
    setUniOpen(false);
    setUniSearch("");
  };

  const handleAddCustomUniversity = async () => {
    const trimmed = uniSearch.trim();
    if (!trimmed || isAdding) return;
    setIsAdding(true);
    try {
      await autoAddUniversity(trimmed, city);
      setUniversity(trimmed);
      setUniOpen(false);
      setUniSearch("");
    } finally {
      setIsAdding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    setIsSubmitting(true);
    try {
      const success = await onUpdateProfile({
        university: university.trim() || null,
        city: trimmedCity,
      });
      if (success) onNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = city.trim().length > 0;

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={6}
      onBack={onBack}
    >
      <div className="w-full max-w-md space-y-5">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-secondary rounded-full w-14 h-14 flex items-center justify-center">
              <MapPin className="h-7 w-7 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold mb-2 text-foreground">
            Where are you headed?
          </h1>
          <p className="text-sm text-muted-foreground">
            We'll connect you with students in the same place.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: City */}
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5 ml-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Destination city
              </p>
              <CityAutocomplete
                value={city}
                onChange={handleCityChange}
                placeholder="Where are you going? (e.g. Barcelona)"
              />
            </div>

            {/* Step 2: University (only after city is selected) */}
            {city && (
              <div className="animate-fade-in">
                <p className="text-xs font-medium text-muted-foreground mb-1.5 ml-0.5 flex items-center gap-1">
                  <School className="h-3 w-3" />
                  University in {city}
                </p>

                <Popover open={uniOpen} onOpenChange={setUniOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={uniOpen}
                      className={cn(
                        "w-full justify-between",
                        !university && "text-muted-foreground"
                      )}
                    >
                      <span className="truncate">
                        {university || "Select your university..."}
                      </span>
                      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput
                        placeholder="Search universities..."
                        value={uniSearch}
                        onValueChange={setUniSearch}
                        className="bg-background"
                      />
                      <CommandList className="max-h-[200px]">
                        <CommandGroup>
                          {searchedUniversities.map((uni) => (
                            <CommandItem
                              key={uni.id}
                              value={uni.name}
                              onSelect={() => handleSelectUniversity(uni.name)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  university === uni.name ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {uni.name}
                            </CommandItem>
                          ))}
                          {showAddOption && (
                            <CommandItem
                              value={`custom-add-${uniSearch}`}
                              onSelect={handleAddCustomUniversity}
                              className="text-primary"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add "{uniSearch.trim()}"
                            </CommandItem>
                          )}
                          {isAdding && (
                            <CommandItem value="adding-indicator" disabled className="text-muted-foreground">
                              <Plus className="mr-2 h-4 w-4 animate-spin" />
                              Adding...
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Hint text */}
          {!city && (
            <p className="text-xs text-center text-muted-foreground/70">
              You can always update your university later on your profile.
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !canSubmit}
            className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </OnboardingLayout>
  );
};
