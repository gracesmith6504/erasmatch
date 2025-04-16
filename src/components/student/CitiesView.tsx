
import React, { useState, useMemo } from "react";
import { Profile } from "@/types";
import CityCard from "./CityCard";
import CityProfileList from "./CityProfileList";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CitiesViewProps {
  profiles: Profile[];
  currentUserId: string | null;
}

const CitiesView = ({ profiles, currentUserId }: CitiesViewProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Filter out current user and deleted users from profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => 
      profile.id !== currentUserId && !profile.deleted_at
    );
  }, [profiles, currentUserId]);
  
  // Get unique cities and count students in each
  const cityData = useMemo(() => {
    const cities = new Map<string, number>();
    
    filteredProfiles.forEach(profile => {
      if (profile.city) {
        const count = cities.get(profile.city) || 0;
        cities.set(profile.city, count + 1);
      }
    });
    
    return Array.from(cities.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }, [filteredProfiles]);
  
  // Filter cities based on search
  const filteredCities = useMemo(() => {
    if (!searchTerm) return cityData;
    
    const term = searchTerm.toLowerCase();
    return cityData.filter(item => 
      item.city.toLowerCase().includes(term)
    );
  }, [cityData, searchTerm]);
  
  // Get profiles for selected city
  const cityProfiles = useMemo(() => {
    if (!selectedCity) return [];
    
    return filteredProfiles.filter(profile => 
      profile.city === selectedCity
    );
  }, [filteredProfiles, selectedCity]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold gradient-text mb-6">
        {selectedCity ? `Students in ${selectedCity}` : "Explore Students by City"}
      </h1>
      
      {!selectedCity && (
        <>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <Input
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-erasmatch-blue"
            />
          </div>
          
          <div className="mb-4 text-sm text-gray-600">
            Showing <span className="font-medium text-gray-900">{filteredCities.length}</span> cities with students
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCities.map(({ city, count }) => (
              <CityCard
                key={city}
                city={city}
                studentCount={count}
                isSelected={city === selectedCity}
                onClick={() => setSelectedCity(city)}
              />
            ))}
            
            {filteredCities.length === 0 && (
              <div className="col-span-3 text-center py-8 bg-white rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-medium text-gray-900 mb-2">No cities found</h2>
                <p className="text-gray-600">Try adjusting your search term</p>
              </div>
            )}
          </div>
        </>
      )}
      
      {selectedCity && (
        <CityProfileList
          city={selectedCity}
          profiles={cityProfiles}
          onResetCity={() => setSelectedCity(null)}
        />
      )}
    </div>
  );
};

export default CitiesView;
