
import { useState, useEffect, useMemo } from "react";
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useBlockedUsers } from "@/hooks/useBlockedUsers";

interface InitialFilters {
  city?: string;
  university?: string;
}

export const useStudentsData = (initialProfiles: Profile[], currentUserId: string | null, initialFilters?: InitialFilters) => {
  const { blockedIds } = useBlockedUsers();
  const [universityFilter, setUniversityFilter] = useState(initialFilters?.university || "");
  const [cityFilter, setCityFilter] = useState(initialFilters?.city || "");
  const [personalityTagsFilter, setPersonalityTagsFilter] = useState<string[]>([]);
  const [semesterFilter, setSemesterFilter] = useState<string[]>([]);

  const [universityCityMap, setUniversityCityMap] = useState<Record<string, string>>({});
  const [universityCountryMap, setUniversityCountryMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Fetch university→city and university→country mappings
  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const { data } = await supabase
          .from('universities')
          .select('name, city, country');

        const cityMap: Record<string, string> = {};
        const countryMap: Record<string, string> = {};
        if (data) {
          for (const uni of data) {
            if (uni.name && uni.city) cityMap[uni.name] = uni.city;
            if (uni.name && uni.country) countryMap[uni.name] = uni.country;
          }
        }
        setUniversityCityMap(cityMap);
        setUniversityCountryMap(countryMap);
      } catch (error) {
        console.error('Error fetching university data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, []);

  // Mark loading as false once initialProfiles arrive
  useEffect(() => {
    if (initialProfiles.length > 0) {
      setLoading(false);
    }
  }, [initialProfiles]);

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

  const uniqueSemesters = useMemo(() =>
    [...new Set(initialProfiles.map(p => p.semester).filter(Boolean))].sort() as string[],
    [initialProfiles]
  );

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
      const semesterMatch = semesterFilter.length === 0 ||
        (profile.semester && semesterFilter.includes(profile.semester));

      return uniMatch && cityMatch && tagMatch && semesterMatch;
    }),
    [initialProfiles, currentUserId, blockedIds, universityFilter, cityFilter, personalityTagsFilter, semesterFilter]
  );

  const resetFilters = () => {
    setUniversityFilter("");
    setCityFilter("");
    setPersonalityTagsFilter([]);
    setSemesterFilter([]);
  };

  return {
    universityFilter,
    setUniversityFilter,
    cityFilter,
    setCityFilter,
    personalityTagsFilter,
    setPersonalityTagsFilter,
    semesterFilter,
    setSemesterFilter,
    uniqueUniversities,
    uniqueCities,
    uniqueSemesters,
    filteredProfiles,
    featuredProfiles,
    universityCityMap,
    universityCountryMap,
    loading,
    resetFilters
  };
};

