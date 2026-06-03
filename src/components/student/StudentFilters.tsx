import React, { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { School, MapPin, X, User, ChevronDown, ChevronUp, Search, Plane, SlidersHorizontal, CalendarRange } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PERSONALITY_TAGS } from "@/components/profile/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";


interface StudentFiltersProps {
  universityFilter: string;
  setUniversityFilter: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  personalityTagsFilter: string[];
  setPersonalityTagsFilter: (tags: string[]) => void;
  seasonFilter: string[];
  setSeasonFilter: (tags: string[]) => void;
  overlapOnly: boolean;
  setOverlapOnly: (v: boolean) => void;
  myWindowLabel: string | null;
  uniqueUniversities: string[];
  uniqueCities: string[];
  seasonOptions: string[];
  resetFilters: () => void;
}

const StudentFilters = ({
  universityFilter,
  setUniversityFilter,
  cityFilter,
  setCityFilter,
  personalityTagsFilter,
  setPersonalityTagsFilter,
  seasonFilter,
  setSeasonFilter,
  overlapOnly,
  setOverlapOnly,
  myWindowLabel,
  uniqueUniversities,
  uniqueCities,
  seasonOptions,
  resetFilters,
}: StudentFiltersProps) => {

  const isMobile = useIsMobile();
  const [showAllTags, setShowAllTags] = useState(false);
  const [uniSearch, setUniSearch] = useState("");
  const [uniDropdownOpen, setUniDropdownOpen] = useState(false);
  const uniRef = useRef<HTMLDivElement>(null);
  const [citySearch, setCitySearch] = useState("");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (uniRef.current && !uniRef.current.contains(e.target as Node)) {
        setUniDropdownOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Server-side alias-aware search, intersected with universities that have students
  const [rpcMatches, setRpcMatches] = useState<string[] | null>(null);
  const reqIdRef = useRef(0);
  useEffect(() => {
    const q = uniSearch.trim();
    if (!q) {
      setRpcMatches(null);
      return;
    }
    const myReq = ++reqIdRef.current;
    const t = setTimeout(async () => {
      const { data, error } = await supabase.rpc("search_universities", {
        _q: q,
        _limit: 100,
        _city: null,
      });
      if (myReq !== reqIdRef.current) return;
      if (error || !data) {
        setRpcMatches([]);
        return;
      }
      setRpcMatches((data as Array<{ name: string }>).map((r) => r.name));
    }, 150);
    return () => clearTimeout(t);
  }, [uniSearch]);

  const filteredUniversities = (() => {
    const q = uniSearch.trim().toLowerCase();
    if (!q) return uniqueUniversities;
    const localHits = uniqueUniversities.filter((u) => u.toLowerCase().includes(q));
    // Merge RPC results (full DB, alias-aware) with local hits — do NOT intersect.
    // Selecting a university with zero students is fine; the grid will show its empty state.
    const seen = new Set<string>();
    const merged: string[] = [];
    const source = [...(rpcMatches ?? []), ...localHits];
    for (const n of source) {
      const key = n.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        const canonical = uniqueUniversities.find((u) => u.toLowerCase() === key) || n;
        merged.push(canonical);
      }
    }
    return merged;
  })();

  const handleSeasonToggle = (season: string) => {
    if (seasonFilter.includes(season)) {
      setSeasonFilter(seasonFilter.filter(s => s !== season));
    } else {
      setSeasonFilter([...seasonFilter, season]);
    }
  };

  const activeFilterCount =
    (universityFilter ? 1 : 0) +
    (cityFilter ? 1 : 0) +
    (personalityTagsFilter.length > 0 ? 1 : 0) +
    (seasonFilter.length > 0 ? 1 : 0) +
    (overlapOnly ? 1 : 0);


  const isAnyFilterActive = activeFilterCount > 0;

  const handleTagToggle = (tagValue: string) => {
    if (personalityTagsFilter.includes(tagValue)) {
      setPersonalityTagsFilter(personalityTagsFilter.filter(tag => tag !== tagValue));
    } else {
      setPersonalityTagsFilter([...personalityTagsFilter, tagValue]);
    }
  };

  const getTagColor = (tag: string) => {
    const colors = [
      "bg-erasmatch-blue/10 text-erasmatch-blue",
      "bg-erasmatch-green/10 text-erasmatch-green",
      "bg-erasmatch-purple/10 text-erasmatch-purple",
      "bg-erasmatch-yellow/10 text-erasmatch-yellow",
      "bg-erasmatch-coral/10 text-erasmatch-coral",
      "bg-erasmatch-blue/10 text-erasmatch-blue",
      "bg-erasmatch-orange/10 text-erasmatch-orange",
      "bg-erasmatch-green/10 text-erasmatch-green",
    ];
    const index = tag.length % colors.length;
    return colors[index];
  };

  const defaultVisibleTags = ["looking-to-meet", "weekend-trips", "clubbing"];
  const priorityTagsData = PERSONALITY_TAGS.filter(tag => defaultVisibleTags.includes(tag.value));
  const otherTagsData = PERSONALITY_TAGS.filter(tag => !defaultVisibleTags.includes(tag.value));

  const filterContent = (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Searchable University Filter */}
        <div ref={uniRef} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              autoFocus={false}
              className="h-12 pl-9 pr-9 border-border focus:border-erasmatch-green"
              placeholder="Search university..."
              value={universityFilter && !uniDropdownOpen ? universityFilter : uniSearch}
              onChange={(e) => {
                setUniSearch(e.target.value);
                setUniDropdownOpen(true);
                if (!e.target.value) setUniversityFilter("");
              }}
              onFocus={() => {
                setUniDropdownOpen(true);
                if (universityFilter) setUniSearch(universityFilter);
              }}
            />
            {universityFilter && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setUniversityFilter("");
                  setUniSearch("");
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {uniDropdownOpen && (
            <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div
                className="px-4 py-2 text-sm cursor-pointer hover:bg-accent transition-colors text-muted-foreground"
                onClick={() => {
                  setUniversityFilter("");
                  setUniSearch("");
                  setUniDropdownOpen(false);
                }}
              >
                All Universities
              </div>
              {filteredUniversities.map((uni) => (
                <div
                  key={uni}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-accent transition-colors text-foreground"
                  onClick={() => {
                    setUniversityFilter(uni);
                    setUniSearch("");
                    setUniDropdownOpen(false);
                    if (isMobile) setSheetOpen(false);
                  }}
                >
                  {uni}
                </div>
              ))}
              {filteredUniversities.length === 0 && (
                <div className="px-4 py-2 text-sm text-muted-foreground">No results</div>
              )}
            </div>
          )}
        </div>

        {/* Searchable City Filter */}
        <div ref={cityRef} className="relative">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              autoFocus={false}
              className="h-12 pl-9 pr-9 border-border focus:border-erasmatch-green"
              placeholder="Search city..."
              value={cityFilter && !cityDropdownOpen ? cityFilter : citySearch}
              onChange={(e) => {
                setCitySearch(e.target.value);
                setCityDropdownOpen(true);
                if (!e.target.value) setCityFilter("");
              }}
              onFocus={() => {
                setCityDropdownOpen(true);
                if (cityFilter) setCitySearch(cityFilter);
              }}
            />
            {cityFilter && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setCityFilter("");
                  setCitySearch("");
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {cityDropdownOpen && (
            <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div
                className="px-4 py-2 text-sm cursor-pointer hover:bg-accent transition-colors text-muted-foreground"
                onClick={() => {
                  setCityFilter("");
                  setCitySearch("");
                  setCityDropdownOpen(false);
                }}
              >
                All Cities
              </div>
              {uniqueCities
                .filter((city) => city.toLowerCase().includes(citySearch.toLowerCase()))
                .map((city) => (
                  <div
                    key={city}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-accent transition-colors text-foreground"
                    onClick={() => {
                      setCityFilter(city);
                      setCitySearch("");
                      setCityDropdownOpen(false);
                      if (isMobile) setSheetOpen(false);
                    }}
                  >
                    {city}
                  </div>
                ))}
              {uniqueCities.filter((city) => city.toLowerCase().includes(citySearch.toLowerCase())).length === 0 && (
                <div className="px-4 py-2 text-sm text-muted-foreground">No results</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Overlap with my stay */}
      {myWindowLabel && (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3">
          <div className="flex items-start gap-2 min-w-0">
            <CalendarRange className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">Overlapping with my stay</div>
              <div className="text-xs text-muted-foreground truncate">Your dates: {myWindowLabel}</div>
            </div>
          </div>
          <Switch checked={overlapOnly} onCheckedChange={setOverlapOnly} />
        </div>
      )}

      {/* Arriving Season Filter */}
      {seasonOptions.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center text-sm font-medium mb-3 text-foreground">
            <Plane className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Arriving Season</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {seasonOptions.map((season) => {
              const isSelected = seasonFilter.includes(season);
              return (
                <Badge
                  key={season}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isSelected ? "bg-erasmatch-coral/10 text-erasmatch-coral" : "hover:bg-secondary"
                  }`}
                  onClick={() => handleSeasonToggle(season)}
                >
                  {season}
                  {isSelected && <X className="h-3 w-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
        </div>
      )}


      {/* Personality Tags Filter */}
      <div className="mt-6">
        <div className="flex items-center text-sm font-medium mb-3 text-foreground">
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Filter by Personality Tags</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {priorityTagsData.map((tag) => {
            const isSelected = personalityTagsFilter.includes(tag.value);
            return (
              <Badge
                key={tag.value}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  isSelected ? getTagColor(tag.value) : "hover:bg-secondary"
                }`}
                onClick={() => handleTagToggle(tag.value)}
              >
                {tag.icon} {tag.label}
                {isSelected && <X className="h-3 w-3 ml-1" />}
              </Badge>
            );
          })}
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {otherTagsData.map((tag) => {
              const isSelected = personalityTagsFilter.includes(tag.value);
              return (
                <Badge
                  key={tag.value}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isSelected ? getTagColor(tag.value) : "hover:bg-secondary"
                  }`}
                  onClick={() => handleTagToggle(tag.value)}
                >
                  {tag.icon} {tag.label}
                  {isSelected && <X className="h-3 w-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>

      {isAnyFilterActive && (
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border">
          <div className="text-sm text-muted-foreground mr-1">Active filters:</div>
          {universityFilter && universityFilter !== "all-universities" && (
            <div className="inline-flex items-center text-xs bg-erasmatch-purple/10 text-erasmatch-purple py-1 px-2 rounded-full">
              University: {universityFilter}
              <button className="ml-1" onClick={() => setUniversityFilter("")}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {cityFilter && cityFilter !== "all-cities" && (
            <div className="inline-flex items-center text-xs bg-erasmatch-green/10 text-erasmatch-green py-1 px-2 rounded-full">
              City: {cityFilter}
              <button className="ml-1" onClick={() => setCityFilter("")}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {semesterFilter.length > 0 && (
            <div className="inline-flex items-center text-xs bg-erasmatch-coral/10 text-erasmatch-coral py-1 px-2 rounded-full">
              {semesterFilter.length} semester{semesterFilter.length > 1 ? 's' : ''}
              <button className="ml-1" onClick={() => setSemesterFilter([])}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {personalityTagsFilter.length > 0 && (
            <div className="inline-flex items-center text-xs bg-erasmatch-blue/10 text-erasmatch-blue py-1 px-2 rounded-full">
              {personalityTagsFilter.length} personality tag{personalityTagsFilter.length > 1 ? 's' : ''}
              <button className="ml-1" onClick={() => setPersonalityTagsFilter([])}>
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            resetFilters();
            if (isMobile) setSheetOpen(false);
          }}
          className="rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary"
          disabled={!isAnyFilterActive}
        >
          Reset all
        </Button>
      </div>
    </>
  );

  // Mobile: show a button that opens a bottom sheet
  if (isMobile) {
    const handleSheetChange = (open: boolean) => {
      setSheetOpen(open);
      // When sheet closes (e.g. after applying a filter), scroll grid into view
      if (!open) {
        requestAnimationFrame(() => {
          const grid = document.getElementById("student-grid");
          if (grid) {
            const y = grid.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
          }
        });
      }
    };
    return (
      <div className="mb-4">
        <Sheet open={sheetOpen} onOpenChange={handleSheetChange}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between rounded-full border-border/70 h-11 font-medium"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="max-h-[85vh] overflow-y-auto rounded-t-2xl"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <SheetHeader>
              <SheetTitle className="text-left">Filters</SheetTitle>
            </SheetHeader>
            <div className="pt-4">
              {filterContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop: show filters inline as before
  return (
    <div className="bg-card shadow-soft rounded-2xl p-6 mb-8 border border-border">
      {filterContent}
    </div>
  );
};

export default StudentFilters;
