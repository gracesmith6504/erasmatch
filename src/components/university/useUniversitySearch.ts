
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { University } from "./types";

export function useUniversitySearch() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Initial fetch when component mounts
    fetchUniversities();
  }, []);

  const fetchUniversities = async (query = "") => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('universities')
        .select('id, name, city, country');
      
      if (error) {
        console.error("Error fetching universities:", error);
        setUniversities([]);
        return;
      }
      
      if (data) {
        // Cast the data to University type after ensuring it has the correct structure
        const typedData = data.map(uni => ({
          id: uni.id,
          name: uni.name,
          city: uni.city,
          country: uni.country
        })) as University[];
        
        setUniversities(typedData);
      } else {
        setUniversities([]);
      }
    } catch (error) {
      console.error("Error in fetch operation:", error);
      setUniversities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    const fetchWithQuery = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('universities')
          .select('id, name, city, country')
          .ilike('name', `%${query}%`)
          .limit(10);
          
        if (error) {
          console.error("Error searching universities:", error);
          setUniversities([]);
          return;
        }
        
        if (data) {
          // Cast the data to University type after ensuring it has the correct structure
          const typedData = data.map(uni => ({
            id: uni.id,
            name: uni.name,
            city: uni.city,
            country: uni.country
          })) as University[];
          
          setUniversities(typedData);
        } else {
          setUniversities([]);
        }
      } catch (error) {
        console.error("Error in search operation:", error);
        setUniversities([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWithQuery();
  };

  return {
    universities,
    isLoading,
    searchQuery,
    setSearchQuery,
    handleSearch
  };
}
