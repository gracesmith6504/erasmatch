
import { useState, useEffect } from "react";
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const useStudentsData = (initialProfiles: Profile[], currentUserId: string | null) => {
  const [universityFilter, setUniversityFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [personalityTagsFilter, setPersonalityTagsFilter] = useState<string[]>([]);

  const [uniqueUniversities, setUniqueUniversities] = useState<string[]>([]);
  const [uniqueCities, setUniqueCities] = useState<string[]>([]);
  const [loadedProfiles, setLoadedProfiles] = useState<Profile[]>(initialProfiles);
  const [loading, setLoading] = useState(true);
  const [featuredProfiles, setFeaturedProfiles] = useState<Profile[]>([]);

  // Fetch profiles from Supabase with optimized selection
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Only select the fields we need, not "*"
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, university, city, semester, personality_tags, avatar_url, deleted_at, home_university, featured')
          .is('deleted_at', null);
        
        if (error) {
          throw error;
        }

        if (data) {
          // Ensure all profiles have the required fields
          const profilesWithRequiredFields = data.map(profile => ({
            ...profile,
            country: null,
            interests: null,
            personality_tags: profile.personality_tags || []
          })) as unknown as Profile[];
          
          // Separate featured profiles
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

    fetchProfiles();
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

  // Filter profiles based on university, city, and personality tag filters
  const filteredProfiles = loadedProfiles.filter(profile => {
    // Skip current user and deleted users
    if (
          profile.id === currentUserId ||
          profile.deleted_at ||
          (!profile.university && !profile.home_university)
        ) return false;


    const uniMatch = !universityFilter || universityFilter === "all-universities" || profile.university === universityFilter;
    const cityMatch = !cityFilter || cityFilter === "all-cities" || profile.city === cityFilter;
    
    // Personality tags filter - show profiles that have ANY of the selected tags (OR logic)
    const tagMatch = personalityTagsFilter.length === 0 || 
      (profile.personality_tags && profile.personality_tags.some(tag => personalityTagsFilter.includes(tag)));

    return uniMatch && cityMatch && tagMatch;
  });

  const resetFilters = () => {
    setUniversityFilter("");
    setCityFilter("");
    setPersonalityTagsFilter([]);
  };

  return {
    universityFilter,
    setUniversityFilter,
    cityFilter,
    setCityFilter,
    personalityTagsFilter,
    setPersonalityTagsFilter,
    uniqueUniversities,
    uniqueCities,
    filteredProfiles,
    featuredProfiles,
    loading,
    resetFilters
  };
};
