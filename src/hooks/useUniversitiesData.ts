
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { University } from "@/components/university/types";
import { useUniversitiesCache } from "@/hooks/useUniversitiesCache";

export function useUniversitiesData() {
  const { universities: cachedUniversities, loading: cacheLoading } = useUniversitiesCache();
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
        
        if (cachedUniversities.length > 0) {
          // Use our cache for basic universities data
          console.log("Using cached universities data as base");
          
          // Then, fetch student counts from profiles table
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('university')
            .is('deleted_at', null);

          if (profilesError) {
            throw profilesError;
          }

          // Count students per university
          const studentCountMap = new Map<string, number>();
          profilesData?.forEach(profile => {
            if (profile.university) {
              const count = studentCountMap.get(profile.university) || 0;
              studentCountMap.set(profile.university, count + 1);
            }
          });

          // Now fetch additional university details (only those we need)
          const { data: uniDetails, error: uniError } = await supabase
            .from('universities')
            .select('id, overview, erasmus_tips, accommodation_info, popular_courses, image_url, links');

          if (uniError) {
            throw uniError;
          }

          // Create a map for quick lookups
          const detailsMap = new Map();
          uniDetails?.forEach(uni => detailsMap.set(uni.id, uni));

          // Combine university data with student counts and transform to correct type
          const universitiesWithCounts = cachedUniversities.map(uni => {
            // Get additional details if available
            const details = detailsMap.get(uni.id);
            
            // Convert JSON links to the expected format
            let formattedLinks = null;
            if (details?.links && typeof details.links === 'object') {
              const linksObj = details.links as Record<string, unknown>;
              formattedLinks = {
                housing: linksObj.housing as string | undefined,
                transport: linksObj.transport as string | undefined,
                student_groups: linksObj.student_groups as string | undefined
              };
            }
            
            return {
              id: uni.id,
              name: uni.name,
              city: uni.city,
              country: uni.country,
              description: null,
              overview: details?.overview || null,
              erasmus_tips: details?.erasmus_tips || null,
              accommodation_info: details?.accommodation_info || null,
              popular_courses: details?.popular_courses || null,
              image_url: details?.image_url || null,
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
            .filter(Boolean)
            .filter((country, index, self) => country !== null && self.indexOf(country) === index)
            .sort();
          
          setUniqueCountries(countries as string[]);
        }
      } catch (err: any) {
        console.error("Error fetching universities:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!cacheLoading && cachedUniversities.length > 0) {
      fetchUniversities();
    }
  }, [cachedUniversities, cacheLoading]);

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
    loading: loading || cacheLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCountry,
    setSelectedCountry,
    uniqueCountries,
    handleResetFilters
  };
}
