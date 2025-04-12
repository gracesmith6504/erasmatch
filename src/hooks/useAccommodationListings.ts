
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ListingProps } from "@/components/accommodation/ListingCard";

export const useAccommodationListings = () => {
  const [listings, setListings] = useState<ListingProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [roomTypeFilter, setRoomTypeFilter] = useState<string | null>(null);
  const [uniqueCities, setUniqueCities] = useState<string[]>([]);
  const [uniqueRoomTypes, setUniqueRoomTypes] = useState<string[]>([]);

  // Fetch listings from Supabase
  useEffect(() => {
    const fetchListings = async () => {
      try {
        console.log("Fetching listings with filters:", { cityFilter, roomTypeFilter });
        setLoading(true);
        
        let query = supabase
          .from('listings')
          .select('*');
        
        if (cityFilter) {
          query = query.eq('city', cityFilter);
        }
        
        if (roomTypeFilter) {
          query = query.eq('room_type', roomTypeFilter);
        }
        
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching listings:', error);
          throw error;
        }
        
        console.log("Fetched listings:", data?.length || 0);
        if (data) {
          setListings(data as ListingProps[]);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [cityFilter, roomTypeFilter]);

  // Extract unique cities and room types for filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Get unique cities
        const { data: cityData, error: cityError } = await supabase
          .from('listings')
          .select('city')
          .not('city', 'is', null);
        
        if (cityError) throw cityError;
        
        if (cityData) {
          // Trim whitespace and filter out empty values
          const cities = [...new Set(cityData.map(item => item.city?.trim()))]
            .filter(Boolean)
            .sort() as string[];
          setUniqueCities(cities);
        }
        
        // Get unique room types
        const { data: roomTypeData, error: roomTypeError } = await supabase
          .from('listings')
          .select('room_type')
          .not('room_type', 'is', null);
        
        if (roomTypeError) throw roomTypeError;
        
        if (roomTypeData) {
          // Trim whitespace and filter out empty values
          const roomTypes = [...new Set(roomTypeData.map(item => item.room_type?.trim()))]
            .filter(Boolean)
            .sort() as string[];
          setUniqueRoomTypes(roomTypes);
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  const resetFilters = () => {
    setCityFilter(null);
    setRoomTypeFilter(null);
  };

  return {
    listings,
    loading,
    cityFilter,
    setCityFilter,
    roomTypeFilter,
    setRoomTypeFilter,
    uniqueCities,
    uniqueRoomTypes,
    resetFilters,
    hasActiveFilters: Boolean(cityFilter || roomTypeFilter)
  };
};
