import { useState, useEffect, useRef } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, School, Check, ChevronsUpDown, Plus, Briefcase, Loader2 } from "lucide-react";
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

type HipoUniversity = {
  name: string;
  country: string;
  "state-province": string | null;
  alpha_two_code: string;
  domains: string[];
  web_pages: string[];
};

const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID || "ceoflcktscennfmmdrvp";
const HIPO_PROXY_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/university-search`;

const CONFIDENT_MATCH_SCORE = 600;

const INTERNSHIP_SENTINEL = "Internship/Work";

const normalizeString = (str: string) =>
  str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

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
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [searchedUniversities, setSearchedUniversities] = useState<UniRow[]>([]);
  const [apiFallbackResults, setApiFallbackResults] = useState<UniRow[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reqIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const trimmedCity = city.trim();

  useEffect(() => {
    if (isInternship) {
      setSearchedUniversities([]);
      setApiFallbackResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const myReq = ++reqIdRef.current;
    const trimmedSearch = uniSearch.trim();
    if (trimmedSearch) setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      const { data, error } = await (supabase as any).rpc("search_universities", {
        _q: trimmedSearch,
        _limit: trimmedSearch ? 100 : 50,
        _city: trimmedCity || null,
      });
      if (myReq !== reqIdRef.current) return;
      if (error) {
        console.error("search_universities error", error);
        setSearchedUniversities([]);
        setApiFallbackResults([]);
        setIsSearching(false);
        return;
      }
      const results = (data ?? []) as UniRow[];
      setSearchedUniversities(results);
      setIsSearching(false);

      if (trimmedSearch.length >= 3 && results.length < 3) {
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        setIsSearchingApi(true);
        try {
          const response = await fetch(
            `${HIPO_PROXY_URL}?name=${encodeURIComponent(trimmedSearch)}`,
            { signal: controller.signal }
          );
          if (myReq !== reqIdRef.current) return;
          if (!response.ok) throw new Error("API request failed");
          const apiData: HipoUniversity[] = await response.json();
          const mapped: UniRow[] = apiData.slice(0, 10).map((item, index) => ({
            id: -(index + 1),
            name: item.name,
            city: null,
            country: item.country || null,
          }));
          const localNames = new Set(results.map(u => u.name.toLowerCase()));
          setApiFallbackResults(mapped.filter(u => !localNames.has(u.name.toLowerCase())));
        } catch (err: any) {
          if (err.name !== "AbortError") setApiFallbackResults([]);
        } finally {
          setIsSearchingApi(false);
        }
      } else {
        setApiFallbackResults([]);
      }
    }, trimmedSearch ? 100 : 0);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [uniSearch, trimmedCity, isInternship]);

  // When the city changes, clear the selected university — it may not be
  // in the new city. Keep it only if the user hasn't touched the city yet.
  const prevCityRef = useRef(trimmedCity);
  useEffect(() => {
    if (prevCityRef.current && trimmedCity !== prevCityRef.current) {
      setUniversity("");
    }
    prevCityRef.current = trimmedCity;
  }, [trimmedCity]);

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const hasExactMatch = (() => {
    if (!uniSearch.trim()) return true;
    const q = normalizeString(uniSearch);
    const allResults = [...searchedUniversities, ...apiFallbackResults];
    if (allResults.some((u) => normalizeString(u.name) === q)) return true;
    const top = searchedUniversities[0];
    return !!top && (top.score ?? 0) >= CONFIDENT_MATCH_SCORE;
  })();

  const showAddOption = uniSearch.trim().length > 1 && !hasExactMatch && !isAdding;

  const handleSelectUniversity = (uni: UniRow) => {
    setUniversity(uni.name);
    if (uni.city && !trimmedCity) setCity(uni.city);
    setUniOpen(false);
    setUniSearch("");
  };

  const handleSelectApiUniversity = async (uni: UniRow) => {
    const resolved = await autoAddUniversity(uni.name, city || "");
    setUniversity(resolved || uni.name);
    setUniOpen(false);
    setUniSearch("");
  };

  const handleAddCustomUniversity = async () => {
    const trimmed = uniSearch.trim();
    if (!trimmed || isAdding) return;
    setIsAdding(true);
    try {
      const resolved = await autoAddUniversity(trimmed, city || "");
      setUniversity(resolved || trimmed);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    ? trimmedCity.length > 0
    : university.trim().length > 0 && trimmedCity.length > 0;

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
            {isInternship ? "Where are you based?" : "Where are you headed?"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isInternship
              ? "Tell us the city for your internship or placement."
              : "Pick your destination city — we'll show universities there."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-4">
            {/* City — always first */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5 ml-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {isInternship ? "City" : "Destination city"}
              </p>
              <CityAutocomplete
                value={city}
                onChange={setCity}
                placeholder={isInternship ? "Where are you based? (e.g. Lisbon)" : "Where are you going? (e.g. Budapest)"}
              />
            </div>

            {/* University — shown after city is selected (study mode only) */}
            {!isInternship && trimmedCity && (
              <div className="animate-fade-in">
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
                      <CommandList className="max-h-[320px]">
                        {(isSearching || isSearchingApi) && (
                          <div className="flex items-center justify-center gap-2 py-3 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-xs">Searching...</span>
                          </div>
                        )}
                        {searchedUniversities.length > 0 && (
                          <CommandGroup heading={apiFallbackResults.length > 0 ? "From our database" : undefined}>
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
                          </CommandGroup>
                        )}
                        {apiFallbackResults.length > 0 && (
                          <CommandGroup heading="Found online">
                            {apiFallbackResults.map((uni, index) => (
                              <CommandItem
                                key={`api-${index}`}
                                value={`api-${uni.name}`}
                                onSelect={() => handleSelectApiUniversity(uni)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 shrink-0",
                                    university === uni.name ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{uni.name}</span>
                                  {uni.country && (
                                    <span className="text-xs text-muted-foreground">{uni.country}</span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                        <CommandGroup>
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
                        {!searchedUniversities.length && !apiFallbackResults.length && !isSearching && !isSearchingApi && !showAddOption && !isAdding && uniSearch.trim().length > 0 && (
                          <CommandGroup>
                            <div className="p-4 text-center">
                              <p className="text-sm text-muted-foreground">No university found</p>
                            </div>
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
