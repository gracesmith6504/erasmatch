
import { useState, useEffect } from "react";
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const useStudentsData = (initialProfiles: Profile[], currentUserId: string | null) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [universityFilter, setUniversityFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");

  const [uniqueUniversities, setUniqueUniversities] = useState<string[]>([]);
  const [uniqueCities, setUniqueCities] = useState<string[]>([]);
  const [uniqueSemesters, setUniqueSemesters] = useState<string[]>([]);
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
      const semesters = [...new Set(loadedProfiles.map(p => p.semester).filter(Boolean))] as string[];
      
      setUniqueUniversities(universities);
      setUniqueCities(cities);
      setUniqueSemesters(semesters);
    }
  }, [loadedProfiles]);

  // Filter profiles based on search and filters
  const filteredProfiles = loadedProfiles.filter(profile => {
    // Skip current user
    if (profile.id === currentUserId) return false;

    const nameMatch = profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) || !searchTerm;
    const uniMatch = !universityFilter || universityFilter === "all-universities" || profile.university === universityFilter;
    const cityMatch = !cityFilter || cityFilter === "all-cities" || profile.city === cityFilter;
    const semesterMatch = !semesterFilter || semesterFilter === "all-semesters" || profile.semester === semesterFilter;

    return nameMatch && uniMatch && cityMatch && semesterMatch;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setUniversityFilter("");
    setCityFilter("");
    setSemesterFilter("");
  };

  return {
    searchTerm,
    setSearchTerm,
    universityFilter,
    setUniversityFilter,
    cityFilter,
    setCityFilter,
    semesterFilter,
    setSemesterFilter,
    uniqueUniversities,
    uniqueCities,
    uniqueSemesters,
    filteredProfiles,
    loading,
    resetFilters
  };
};
