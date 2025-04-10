
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { University } from "@/components/university/types";

export function useUniversitiesData() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [uniqueCountries, setUniqueCountries] = useState<string[]>([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        
        // First, fetch all universities
        const { data: universitiesData, error: universitiesError } = await supabase
          .from('universities')
          .select('*');

        if (universitiesError) {
          throw universitiesError;
        }

        // Then, fetch all profiles to count students per university
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('university');

        if (profilesError) {
          throw profilesError;
        }

        // Count students per university
        const studentCountMap = new Map<string, number>();
        profilesData.forEach(profile => {
          if (profile.university) {
            const count = studentCountMap.get(profile.university) || 0;
            studentCountMap.set(profile.university, count + 1);
          }
        });

        // Combine university data with student counts and transform to correct type
        const universitiesWithCounts = universitiesData.map(uni => {
          // Convert JSON links to the expected format
          let formattedLinks = null;
          
          if (uni.links && typeof uni.links === 'object') {
            const links = uni.links as Record<string, unknown>;
            formattedLinks = {
              housing: links.housing as string | undefined,
              transport: links.transport as string | undefined,
              student_groups: links.student_groups as string | undefined
            };
          }
          
          return {
            ...uni,
            student_count: studentCountMap.get(uni.name) || 0,
            links: formattedLinks
          } as University;
        });

        // Sort by student count (descending)
        const sortedUniversities = universitiesWithCounts.sort(
          (a, b) => (b.student_count || 0) - (a.student_count || 0)
        );
        
        setUniversities(sortedUniversities);
        setFilteredUniversities(sortedUniversities);
        
        // Extract unique countries
        const countries = sortedUniversities
          .map(uni => uni.country)
          .filter(Boolean) // Remove null/undefined values
          .filter((country, index, self) => self.indexOf(country) === index)
          .sort();
        
        setUniqueCountries(countries);
      } catch (err: any) {
        console.error("Error fetching universities:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Filter universities based on search query and selected country
  useEffect(() => {
    let filtered = [...universities];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(uni => 
        (uni.name && uni.name.toLowerCase().includes(query)) ||
        (uni.city && uni.city.toLowerCase().includes(query)) ||
        (uni.country && uni.country.toLowerCase().includes(query))
      );
    }
    
    // Filter by country
    if (selectedCountry !== "all") {
      filtered = filtered.filter(uni => uni.country === selectedCountry);
    }
    
    setFilteredUniversities(filtered);
  }, [searchQuery, selectedCountry, universities]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCountry("all");
    setFilteredUniversities(universities);
  };

  return {
    universities,
    filteredUniversities,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCountry,
    setSelectedCountry,
    uniqueCountries,
    handleResetFilters
  };
}
