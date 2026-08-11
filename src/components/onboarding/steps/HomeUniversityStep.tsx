import { useState, useEffect, useRef } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, MapPin, School, Check, ChevronsUpDown, Plus, Loader2 } from "lucide-react";
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

type UniRow = { id: number; name: string; city: string | null; country: string | null; score?: number };

const CONFIDENT_MATCH_SCORE = 600;

const normalizeString = (str: string) =>
  str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

type HomeUniversityStepProps = {
  initialValue: string;
  initialHomeCity?: string;
  onNext: () => void;
  onBack: () => void;
  onUpdateProfile: (data: any) => Promise<boolean>;
};

export const HomeUniversityStep = ({
  initialValue,
  initialHomeCity = "",
  onNext,
  onBack,
  onUpdateProfile,
}: HomeUniversityStepProps) => {
  const [city, setCity] = useState<string>(initialHomeCity);
  const [homeUniversity, setHomeUniversity] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uniOpen, setUniOpen] = useState(false);
  const [uniSearch, setUniSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedUniversities, setSearchedUniversities] = useState<UniRow[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reqIdRef = useRef(0);

  const trimmedCity = city.trim();

  // Search universities filtered by city (when set)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const myReq = ++reqIdRef.current;
    if (uniSearch.trim()) setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      const { data, error } = await (supabase as any).rpc("search_universities", {
        _q: uniSearch.trim(),
        _limit: uniSearch.trim() ? 100 : 50,
        _city: trimmedCity || null,
      });
      if (myReq !== reqIdRef.current) return;
      if (error) {
        console.error("search_universities error", error);
        setSearchedUniversities([]);
      } else {
        setSearchedUniversities((data ?? []) as UniRow[]);
      }
      setIsSearching(false);
    }, uniSearch.trim() ? 100 : 0);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [uniSearch, trimmedCity]);

  // Clear selected university when city changes
  const prevCityRef = useRef(trimmedCity);
  useEffect(() => {
    if (prevCityRef.current && trimmedCity !== prevCityRef.current) {
      setHomeUniversity("");
    }
    prevCityRef.current = trimmedCity;
  }, [trimmedCity]);

  const hasExactMatch = (() => {
    if (!uniSearch.trim()) return true;
    const q = normalizeString(uniSearch);
    if (searchedUniversities.some((u) => normalizeString(u.name) === q)) return true;
    const top = searchedUniversities[0];
    return !!top && (top.score ?? 0) >= CONFIDENT_MATCH_SCORE;
  })();

  const showAddOption = uniSearch.trim().length > 1 && !hasExactMatch && !isAdding;

  const handleSelectUniversity = (uni: UniRow) => {
    setHomeUniversity(uni.name);
    if (uni.city && !trimmedCity) setCity(uni.city);
    setUniOpen(false);
    setUniSearch("");
  };

  const handleAddCustomUniversity = async () => {
    const trimmed = uniSearch.trim();
    if (!trimmed || isAdding) return;
    setIsAdding(true);
    try {
      await autoAddUniversity(trimmed, city || "");
      setHomeUniversity(trimmed);
      setUniOpen(false);
      setUniSearch("");
    } finally {
      setIsAdding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeUniversity.trim()) return;

    setIsSubmitting(true);
    try {
      const success = await onUpdateProfile({ home_university: homeUniversity.trim() });
      if (success) onNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={6}
      onBack={onBack}
    >
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-secondary rounded-full w-14 h-14 flex items-center justify-center">
              <Home className="h-7 w-7 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold mb-2 text-foreground">
            Where are you coming from?
          </h1>
          <p className="text-sm text-muted-foreground">
            Pick your home city — we'll show universities there.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-4">
            {/* City — always first */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5 ml-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Home city
              </p>
              <CityAutocomplete
                value={city}
                onChange={setCity}
                placeholder="Where are you from? (e.g. Dublin)"
              />
            </div>

            {/* University — shown after city is selected */}
            {trimmedCity && (
              <div className="animate-fade-in">
                <p className="text-xs font-medium text-muted-foreground mb-1.5 ml-0.5 flex items-center gap-1">
                  <School className="h-3 w-3" />
                  Home university
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
                        !homeUniversity && "text-muted-foreground"
                      )}
                    >
                      <span className="truncate">
                        {homeUniversity || "Search your university..."}
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
                      <CommandList className="max-h-[320px]">
                        {isSearching && (
                          <div className="flex items-center justify-center gap-2 py-3 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-xs">Searching...</span>
                          </div>
                        )}
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
                                  homeUniversity === uni.name ? "opacity-100" : "opacity-0"
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
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !homeUniversity.trim()}
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
