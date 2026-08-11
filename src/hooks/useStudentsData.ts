
import { useState, useEffect, useMemo, useRef } from "react";
import { Profile } from "@/types";
import { useBlockedUsers } from "@/hooks/useBlockedUsers";
import { useUniversitiesCache } from "@/hooks/useUniversitiesCache";
import {
  parseSemester,
  getArrivalSeason,
  seasonLabel,
  rangesOverlap,
  buildSeasonOptions,
  formatWindow,
} from "@/lib/semesterParsing";

interface InitialFilters {
  city?: string;
  university?: string;
  season?: string;
  overlap?: boolean;
}

export const useStudentsData = (initialProfiles: Profile[], currentUserId: string | null, initialFilters?: InitialFilters) => {
  const { blockedIds } = useBlockedUsers();
  const [universityFilter, setUniversityFilter] = useState(initialFilters?.university || "");
  const [cityFilter, setCityFilter] = useState(initialFilters?.city || "");
  const [personalityTagsFilter, setPersonalityTagsFilter] = useState<string[]>([]);
  const [seasonFilter, setSeasonFilter] = useState<string[]>(
    initialFilters?.season
      ? initialFilters.season.split(",").map(s => decodeURIComponent(s.trim())).filter(Boolean)
      : []
  );
  const [overlapOnly, setOverlapOnly] = useState(initialFilters?.overlap || false);

  const { universities, loading: uniLoading } = useUniversitiesCache();
  const [loading, setLoading] = useState(true);

  const universityCityMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const uni of universities) {
      if (uni.name && uni.city) map[uni.name] = uni.city;
    }
    return map;
  }, [universities]);

  const universityCountryMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const uni of universities) {
      if (uni.name && uni.country) map[uni.name] = uni.country;
    }
    return map;
  }, [universities]);

  useEffect(() => {
    if (initialProfiles.length > 0 && !uniLoading) {
      setLoading(false);
    }
  }, [initialProfiles, uniLoading]);

  // Track whether the user has manually changed filters — if so, don't
  // overwrite with late-arriving initialFilters (e.g. async profile load).
  const userHasChangedFilters = useRef(false);
  const initialFiltersApplied = useRef(false);

  useEffect(() => {
    // Skip if user has already interacted with filters
    if (userHasChangedFilters.current) return;

    const city = initialFilters?.city || "";
    const university = initialFilters?.university || "";

    // On mount or when initialFilters first becomes available (async profile),
    // apply them. Skip re-applying the same empty values.
    if (!initialFiltersApplied.current && (city || university)) {
      initialFiltersApplied.current = true;
      setCityFilter(city);
      setUniversityFilter(university);
    } else if (!initialFiltersApplied.current && !city && !university) {
      // Mark as applied even if both are empty (no profile yet) so that
      // when profile loads we still get a chance to apply.
      // Don't mark applied — leave it false so the next render with a
      // real value can still apply.
    }
  }, [initialFilters?.city, initialFilters?.university]);

  const uniqueUniversities = useMemo(() =>
    [...new Set(initialProfiles.map(p => p.university).filter(Boolean))]
      .sort((a, b) => a!.localeCompare(b!)) as string[],
    [initialProfiles]
  );

  const uniqueCities = useMemo(() =>
    [...new Set(initialProfiles.map(p => p.city).filter(Boolean))]
      .sort((a, b) => a!.localeCompare(b!)) as string[],
    [initialProfiles]
  );

  const seasonOptions = useMemo(
    () => buildSeasonOptions(initialProfiles.map(p => p.semester)),
    [initialProfiles]
  );

  const currentUserWindow = useMemo(() => {
    if (!currentUserId) return null;
    const me = initialProfiles.find(p => p.id === currentUserId);
    return parseSemester(me?.semester);
  }, [initialProfiles, currentUserId]);

  const myWindowLabel = currentUserWindow ? formatWindow(currentUserWindow) : null;

  const featuredProfiles = useMemo(() =>
    initialProfiles.filter(p => p.featured),
    [initialProfiles]
  );

  const filteredProfiles = useMemo(() =>
    initialProfiles.filter(profile => {
      if (
        profile.id === currentUserId ||
        profile.deleted_at ||
        (!profile.university && !profile.home_university) ||
        blockedIds.includes(profile.id)
      ) return false;

      const uniMatch = !universityFilter || universityFilter === "all-universities" || profile.university === universityFilter;
      const cityMatch = !cityFilter || cityFilter === "all-cities" || profile.city === cityFilter;
      const tagMatch = personalityTagsFilter.length === 0 ||
        (profile.personality_tags && profile.personality_tags.some(tag => personalityTagsFilter.includes(tag)));

      let seasonMatch = true;
      if (seasonFilter.length > 0) {
        const info = getArrivalSeason(profile.semester);
        seasonMatch = !!info && seasonFilter.includes(seasonLabel(info));
      }

      let overlapMatch = true;
      if (overlapOnly && currentUserWindow) {
        const w = parseSemester(profile.semester);
        overlapMatch = !!w && rangesOverlap(currentUserWindow, w);
      }

      return uniMatch && cityMatch && tagMatch && seasonMatch && overlapMatch;
    }),
    [initialProfiles, currentUserId, blockedIds, universityFilter, cityFilter, personalityTagsFilter, seasonFilter, overlapOnly, currentUserWindow]
  );

  const handleSetCityFilter = (value: string) => {
    userHasChangedFilters.current = true;
    setCityFilter(value);
  };

  const handleSetUniversityFilter = (value: string) => {
    userHasChangedFilters.current = true;
    setUniversityFilter(value);
  };

  const resetFilters = () => {
    setUniversityFilter("");
    setCityFilter("");
    setPersonalityTagsFilter([]);
    setSeasonFilter([]);
    setOverlapOnly(false);
  };

  return {
    universityFilter,
    setUniversityFilter: handleSetUniversityFilter,
    cityFilter,
    setCityFilter: handleSetCityFilter,
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
    filteredProfiles,
    featuredProfiles,
    universityCityMap,
    universityCountryMap,
    loading,
    resetFilters
  };
};
