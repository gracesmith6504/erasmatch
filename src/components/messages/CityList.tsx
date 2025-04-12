
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";
import { CityListItem } from "./CityListItem";

type CityChat = {
  city_name: string;
  participants_count: number;
  last_message?: {
    content: string;
    created_at: string;
    sender_name: string;
  } | null;
};

type CityListProps = {
  profiles: Profile[];
  currentUserProfile: Profile | null;
  onSelectCityChat: (cityName: string) => void;
  selectedCityChat: string | null;
};

export const CityList = ({
  profiles,
  currentUserProfile,
  onSelectCityChat,
  selectedCityChat,
}: CityListProps) => {
  const [availableCities, setAvailableCities] = useState<CityChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      if (!currentUserProfile?.city) {
        setIsLoading(false);
        return;
      }

      try {
        // Get participants count for the city
        const cityResidents = profiles.filter(
          (profile) => profile.city === currentUserProfile.city
        );
        
        // Get latest message for the city
        const { data: latestMessages, error } = await supabase
          .from("city_messages")
          .select("*")
          .eq("city_name", currentUserProfile.city)
          .order("created_at", { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        const latestMessage = latestMessages?.[0];
        
        const cityChat: CityChat = {
          city_name: currentUserProfile.city,
          participants_count: cityResidents.length,
          last_message: latestMessage 
            ? {
                content: latestMessage.content,
                created_at: latestMessage.created_at,
                sender_name: profiles.find(p => p.id === latestMessage.sender_id)?.name || 'Unknown user'
              }
            : null
        };
        
        setAvailableCities([cityChat]);
      } catch (error) {
        console.error("Error fetching city chats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCities();
  }, [currentUserProfile, profiles]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-16 bg-gray-100 rounded-lg mb-2"></div>
        </div>
      </div>
    );
  }

  if (!currentUserProfile?.city) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <p className="text-sm text-gray-500">
          Select your destination city to join your city chat.
        </p>
      </div>
    );
  }

  if (availableCities.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <p className="text-sm text-gray-500">No city chats available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium px-4">🏙️ City Group Chats</h3>
      {availableCities.map((city) => (
        <CityListItem
          key={city.city_name}
          cityName={city.city_name}
          participantsCount={city.participants_count}
          lastMessage={city.last_message}
          isSelected={selectedCityChat === city.city_name}
          onClick={() => onSelectCityChat(city.city_name)}
        />
      ))}
    </div>
  );
};
