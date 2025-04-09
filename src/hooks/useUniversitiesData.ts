
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
        
        // Create a query that joins universities with profiles to get student counts
        const { data: universitiesWithStudentCounts, error } = await supabase
          .from('universities')
          .select(`
            *,
            student_count:profiles(count)
          `)
          .order('student_count', { ascending: false });

        if (error) {
          throw error;
        }

        // Format the data to include the student_count
        const universities = universitiesWithStudentCounts.map(uni => ({
          ...uni,
          student_count: uni.student_count[0].count || 0
        }));
        
        setUniversities(universities);
        setFilteredUniversities(universities);
        
        // Extract unique countries
        const countries = universities
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
