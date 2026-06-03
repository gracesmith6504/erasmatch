import { useState, useEffect, useRef } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, School, Check, ChevronsUpDown, Plus, Briefcase } from "lucide-react";
import { CityAutocomplete } from "@/components/CityAutocomplete";
import { supabase } from "@/integrations/supabase/client";
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

type UniRow = { id: number; name: string; city: string | null; country: string | null };

const INTERNSHIP_SENTINEL = "Internship/Work";

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
  const [isInternship, setIsInternship] = useState(initialValue === INTERNSHIP_SENTINEL);
  const [city, setCity] = useState<string>(initialCity);
  const [university, setUniversity] = useState(
    initialValue && initialValue !== INTERNSHIP_SENTINEL ? initialValue : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uniOpen, setUniOpen] = useState(false);
  const [uniSearch, setUniSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [searchedUniversities, setSearchedUniversities] = useState<UniRow[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reqIdRef = useRef(0);

  useEffect(() => {
    if (isInternship) {
      setSearchedUniversities([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const myReq = ++reqIdRef.current;
    debounceRef.current = setTimeout(async () => {
      const { data, error } = await (supabase as any).rpc("search_universities", {
        _q: uniSearch.trim(),
        _limit: uniSearch.trim() ? 100 : 25,
        _city: null,
      });
      if (myReq !== reqIdRef.current) return;
      if (error) {
        console.error("search_universities error", error);
        setSearchedUniversities([]);
      } else {
        setSearchedUniversities((data ?? []) as UniRow[]);
      }
    }, uniSearch.trim() ? 180 : 0);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [uniSearch, isInternship]);

  const hasExactMatch = (() => {
    if (!uniSearch.trim()) return true;
    const q = normalizeString(uniSearch);
    return searchedUniversities.some((u) => normalizeString(u.name) === q);
  })();

  const showAddOption = uniSearch.trim().length > 1 && !hasExactMatch && !isAdding;

  const handleSelectUniversity = (uni: UniRow) => {
    setUniversity(uni.name);
    if (uni.city) setCity(uni.city);
    setUniOpen(false);
    setUniSearch("");
  };

  const handleAddCustomUniversity = async () => {
    const trimmed = uniSearch.trim();
    if (!trimmed || isAdding) return;
    setIsAdding(true);
    try {
      await autoAddUniversity(trimmed, city || "");
      setUniversity(trimmed);
      setUniOpen(false);
      setUniSearch("");
    } finally {
      setIsAdding(false);
    }
  };

  const switchToInternship = () => {
    setIsInternship(true);
    setUniversity("");
  };

  const switchToStudy = () => {
    setIsInternship(false);
    setCity("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    setIsSubmitting(true);
    try {
      const success = await onUpdateProfile({
        university: isInternship ? INTERNSHIP_SENTINEL : (university.trim() || null),
        city: trimmedCity,
      });
      if (success) onNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = isInternship
    ? city.trim().length > 0
    : university.trim().length > 0 && city.trim().length > 0;

  return (
    <OnboardingLayout currentStep={2} totalSteps={6} onBack={onBack}>
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-secondary rounded-full w-14 h-14 flex items-center justify-center">
              {isInternship ? (
                <Briefcase className="h-7 w-7 text-primary" />
              ) : (
                <MapPin className="h-7 w-7 text-primary" />
              )}
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold mb-2 text-foreground">
            {isInternship ? "Where are you based?" : "Where are you studying?"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isInternship
              ? "Tell us the city for your internship or placement."
              : "Find your host university, we'll handle the city automatically."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-4">
            {!isInternship ? (
              <>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5 ml-0.5 flex items-center gap-1">
                    <School className="h-3 w-3" />
                    Host university
                  </p>
                  <Popover open={uniOpen} onOpenChange={setUniOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={uniOpen}
                        className={cn(
                          "w-full justify-between",
                          !university && "text-muted-foreground"
                        )}
                      >
                        <span className="truncate">
                          {university || "Search your university..."}
                        </span>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search universities..."
                          value={uniSearch}
                          onValueChange={setUniSearch}
                          className="bg-background"
                        />
                        <CommandList className="max-h-[220px]">
                          <CommandGroup>
                            {searchedUniversities.map((uni) => (
                              <CommandItem
                                key={uni.id}
                                value={uni.name}
                                onSelect={() => handleSelectUniversity(uni)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 shrink-0",
                                    university === uni.name ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{uni.name}</span>
                                  {uni.city && (
                                    <span className="text-xs text-muted-foreground">
                                      {uni.city}
                                      {uni.country ? `, ${uni.country}` : ""}
                                    </span>
                                  )}
                                </div>
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

                {university && (
                  <div className="animate-fade-in">
                    <p className="text-xs font-medium text-muted-foreground mb-1.5 ml-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      City
                    </p>
                    <CityAutocomplete
                      value={city}
                      onChange={setCity}
                      placeholder="Destination city"
                    />
                  </div>
                )}
              </>
            ) : (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5 ml-0.5 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  City
                </p>
                <CityAutocomplete
                  value={city}
                  onChange={setCity}
                  placeholder="Where are you based? (e.g. Lisbon)"
                />
              </div>
            )}
          </div>

          <div className="text-center">
            {!isInternship ? (
              <button
                type="button"
                onClick={switchToInternship}
                className="text-xs text-muted-foreground/80 hover:text-foreground underline underline-offset-4 transition-colors"
              >
                Moving for an internship or work instead?
              </button>
            ) : (
              <button
                type="button"
                onClick={switchToStudy}
                className="text-xs text-muted-foreground/80 hover:text-foreground underline underline-offset-4 transition-colors"
              >
                ← Back to study abroad
              </button>
            )}
          </div>

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
