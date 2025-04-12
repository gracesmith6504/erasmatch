
import { useState, useEffect } from "react";
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const useStudentsData = (initialProfiles: Profile[], currentUserId: string | null) => {
  const [universityFilter, setUniversityFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const [uniqueUniversities, setUniqueUniversities] = useState<string[]>([]);
  const [uniqueCities, setUniqueCities] = useState<string[]>([]);
  const [loadedProfiles, setLoadedProfiles] = useState<Profile[]>(initialProfiles);
  const [loading, setLoading] = useState(true);

  // Fetch profiles from Supabase
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          throw error;
        }

        if (data) {
          setLoadedProfiles(data as Profile[]);
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
    // Extract unique filter options
    if (loadedProfiles.length > 0) {
      const universities = [...new Set(loadedProfiles.map(p => p.university).filter(Boolean))] as string[];
      const cities = [...new Set(loadedProfiles.map(p => p.city).filter(Boolean))] as string[];
      
      setUniqueUniversities(universities);
      setUniqueCities(cities);
    }
  }, [loadedProfiles]);

  // Filter profiles based on university and city filters
  const filteredProfiles = loadedProfiles.filter(profile => {
    // Skip current user
    if (profile.id === currentUserId) return false;

    const uniMatch = !universityFilter || universityFilter === "all-universities" || profile.university === universityFilter;
    const cityMatch = !cityFilter || cityFilter === "all-cities" || profile.city === cityFilter;

    return uniMatch && cityMatch;
  });

  const resetFilters = () => {
    setUniversityFilter("");
    setCityFilter("");
  };

  return {
    universityFilter,
    setUniversityFilter,
    cityFilter,
    setCityFilter,
    uniqueUniversities,
    uniqueCities,
    filteredProfiles,
    loading,
    resetFilters
  };
};
