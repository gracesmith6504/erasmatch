
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
  
  // Get profiles for selected city, sorted: photo > recently joined > recently active > completeness
  const cityProfiles = useMemo(() => {
    if (!selectedCity) return [];

    const inCity = filteredProfiles.filter(profile => profile.city === selectedCity);

    const RECENT_MS = 21 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const ts = (v: string | null | undefined) => (v ? new Date(v).getTime() : 0);
    const completion = (p: Profile) => {
      const fields = [p.name, p.university, p.avatar_url, p.bio, p.semester, p.home_university, p.city, p.country, p.interests];
      return fields.filter(Boolean).length;
    };

    return [...inCity].sort((a, b) => {
      const hasPhotoA = Boolean(a.avatar_url);
      const hasPhotoB = Boolean(b.avatar_url);
      if (hasPhotoA !== hasPhotoB) return hasPhotoA ? -1 : 1;

      const createdA = ts(a.created_at);
      const createdB = ts(b.created_at);
      const recentJoinA = now - createdA <= RECENT_MS;
      const recentJoinB = now - createdB <= RECENT_MS;
      if (recentJoinA !== recentJoinB) return recentJoinA ? -1 : 1;
      if (recentJoinA && recentJoinB && createdA !== createdB) return createdB - createdA;

      const activeA = ts(a.last_active_at);
      const activeB = ts(b.last_active_at);
      const recentActiveA = activeA > 0 && now - activeA <= RECENT_MS;
      const recentActiveB = activeB > 0 && now - activeB <= RECENT_MS;
      if (recentActiveA !== recentActiveB) return recentActiveA ? -1 : 1;
      if (recentActiveA && recentActiveB && activeA !== activeB) return activeB - activeA;

      return completion(b) - completion(a);
    });
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
