
import { useState, useEffect } from "react";
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useBlockedUsers } from "@/hooks/useBlockedUsers";

export const useStudentsData = (initialProfiles: Profile[], currentUserId: string | null) => {
  const { blockedIds } = useBlockedUsers();
  const [universityFilter, setUniversityFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [personalityTagsFilter, setPersonalityTagsFilter] = useState<string[]>([]);
  const [semesterFilter, setSemesterFilter] = useState<string[]>([]);

  const [uniqueUniversities, setUniqueUniversities] = useState<string[]>([]);
  const [uniqueCities, setUniqueCities] = useState<string[]>([]);
  const [loadedProfiles, setLoadedProfiles] = useState<Profile[]>(initialProfiles);
  const [loading, setLoading] = useState(true);
  const [featuredProfiles, setFeaturedProfiles] = useState<Profile[]>([]);
  const [universityCityMap, setUniversityCityMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profiles and university cities in parallel
        const [profilesResult, universitiesResult] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, name, university, city, semester, personality_tags, avatar_url, deleted_at, home_university, featured, arrival_date, last_active_at')
            .is('deleted_at', null),
          supabase
            .from('universities')
            .select('name, city')
        ]);

        if (profilesResult.error) throw profilesResult.error;

        // Build university → city map
        const cityMap: Record<string, string> = {};
        if (universitiesResult.data) {
          for (const uni of universitiesResult.data) {
            if (uni.name && uni.city) {
              cityMap[uni.name] = uni.city;
            }
          }
        }
        setUniversityCityMap(cityMap);

        if (profilesResult.data) {
          const profilesWithRequiredFields = profilesResult.data.map(profile => ({
            ...profile,
            country: null,
            interests: null,
            personality_tags: profile.personality_tags || []
          })) as unknown as Profile[];
          
          const featured = profilesWithRequiredFields.filter(p => p.featured);
          setFeaturedProfiles(featured);
          setLoadedProfiles(profilesWithRequiredFields);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loadedProfiles.length > 0) {
      const universities = [...new Set(loadedProfiles.map(p => p.university).filter(Boolean))]
        .sort((a, b) => a!.localeCompare(b!)) as string[];

      const cities = [...new Set(loadedProfiles.map(p => p.city).filter(Boolean))]
        .sort((a, b) => a!.localeCompare(b!)) as string[];

      setUniqueUniversities(universities);
      setUniqueCities(cities);
    }
  }, [loadedProfiles]);

  const uniqueSemesters = [...new Set(
    loadedProfiles.map(p => p.semester).filter(Boolean)
  )].sort() as string[];

  const filteredProfiles = loadedProfiles.filter(profile => {
    if (
      profile.id === currentUserId ||
      profile.deleted_at ||
      (!profile.university && !profile.home_university)
    ) return false;

    const uniMatch = !universityFilter || universityFilter === "all-universities" || profile.university === universityFilter;
    const cityMatch = !cityFilter || cityFilter === "all-cities" || profile.city === cityFilter;
    const tagMatch = personalityTagsFilter.length === 0 || 
      (profile.personality_tags && profile.personality_tags.some(tag => personalityTagsFilter.includes(tag)));
    
    const semesterMatch = semesterFilter.length === 0 || 
      (profile.semester && semesterFilter.includes(profile.semester));

    return uniMatch && cityMatch && tagMatch && semesterMatch;
  });

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
    loading,
    resetFilters
  };
};
