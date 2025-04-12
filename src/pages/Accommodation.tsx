
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AccommodationLoadingSkeleton from "@/components/accommodation/AccommodationLoadingSkeleton";

// Define the Listing type
type Listing = {
  id: string;
  price: string | null;
  room_type: string | null;
  image_url: string | null;
  city: string | null;
  source_url: string | null;
  created_at: string;
  platform: string | null;
  details: string | null;
  availability: string | null;
};

const Accommodation = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [roomTypeFilter, setRoomTypeFilter] = useState<string | null>(null);
  const [uniqueCities, setUniqueCities] = useState<string[]>([]);
  const [uniqueRoomTypes, setUniqueRoomTypes] = useState<string[]>([]);

  // Fetch listings from Supabase
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('listings')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (cityFilter) {
          query = query.eq('city', cityFilter);
        }
        
        if (roomTypeFilter) {
          query = query.eq('room_type', roomTypeFilter);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          setListings(data as Listing[]);
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
          const cities = [...new Set(cityData.map(item => item.city))].filter(Boolean) as string[];
          setUniqueCities(cities);
        }
        
        // Get unique room types
        const { data: roomTypeData, error: roomTypeError } = await supabase
          .from('listings')
          .select('room_type')
          .not('room_type', 'is', null);
        
        if (roomTypeError) throw roomTypeError;
        
        if (roomTypeData) {
          const roomTypes = [...new Set(roomTypeData.map(item => item.room_type))].filter(Boolean) as string[];
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

  if (loading) {
    return <AccommodationLoadingSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-2xl font-bold gradient-text mb-6">Find Accommodation</h1>
      
      {/* Filters */}
      <div className="bg-white shadow-sm rounded-xl p-6 mb-8 border border-gray-100">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Select 
              value={cityFilter || "all-cities"} 
              onValueChange={(value) => setCityFilter(value === "all-cities" ? null : value)}
            >
              <SelectTrigger className="h-12 border-gray-200 focus:border-erasmatch-blue">
                <SelectValue placeholder="Filter by City" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <SelectItem value="all-cities">All Cities</SelectItem>
                {uniqueCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select 
              value={roomTypeFilter || "all-room-types"} 
              onValueChange={(value) => setRoomTypeFilter(value === "all-room-types" ? null : value)}
            >
              <SelectTrigger className="h-12 border-gray-200 focus:border-erasmatch-blue">
                <SelectValue placeholder="Filter by Room Type" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <SelectItem value="all-room-types">All Room Types</SelectItem>
                {uniqueRoomTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {(cityFilter || roomTypeFilter) && (
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              onClick={resetFilters} 
              className="button-hover"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
      
      {/* Listings */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden flex flex-col h-full transition-shadow hover:shadow-md">
              <div className="relative h-48 w-full bg-gray-100">
                {listing.image_url ? (
                  <img 
                    src={listing.image_url} 
                    alt={`${listing.room_type || 'Room'}`}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                  HousingAnywhere
                </div>
              </div>
              
              <CardContent className="flex-grow p-5">
                <h3 className="text-lg font-bold mb-1">
                  {listing.price && `${listing.price} – `}{listing.room_type || 'Room'}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {listing.city && `${listing.city}`}
                </p>
                <p className="text-gray-500 text-sm">
                  {listing.details || listing.availability || 'No details available'}
                </p>
              </CardContent>
              
              <CardFooter className="p-5 pt-0">
                <Button 
                  className="w-full flex items-center justify-center bg-erasmatch-blue hover:bg-erasmatch-blue/90"
                  onClick={() => listing.source_url && window.open(listing.source_url, '_blank')}
                  disabled={!listing.source_url}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Listing
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No listings found. Try another city or room type.</p>
          {(cityFilter || roomTypeFilter) && (
            <Button 
              variant="link" 
              onClick={resetFilters} 
              className="mt-2 text-erasmatch-blue"
            >
              Reset filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Accommodation;
