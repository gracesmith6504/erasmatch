
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { School, MapPin, CalendarClock, Home, Globe, Mail } from "lucide-react";
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface StudentCardProps {
  profile: Profile;
}

const StudentCard = ({ profile }: StudentCardProps) => {
  const [universityCity, setUniversityCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [countryEmoji, setCountryEmoji] = useState<string>("🌍");

  // Helper function to get random interest emojis
  const getInterestEmojis = () => {
    const interests = ["🎭", "🎨", "🎮", "📚", "🎬", "🎵", "👨‍🍳", "🧳", "⚽", "🏄‍♂️", "📸"];
    const count = Math.floor(Math.random() * 3) + 1;
    const selectedEmojis = [];
    
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * interests.length);
      selectedEmojis.push(interests[index]);
    }
    
    return selectedEmojis.join(" ");
  };

  // Country emoji mapping (simplified)
  useEffect(() => {
    const getCountryEmoji = () => {
      if (profile.country === "Spain") return "🇪🇸";
      if (profile.country === "France") return "🇫🇷";
      if (profile.country === "Germany") return "🇩🇪";
      if (profile.country === "Italy") return "🇮🇹";
      if (profile.country === "Netherlands") return "🇳🇱";
      if (profile.country === "Portugal") return "🇵🇹";
      if (profile.country === "Greece") return "🇬🇷";
      if (profile.country === "United Kingdom") return "🇬🇧";
      return "🌍";
    };
    
    setCountryEmoji(getCountryEmoji());
  }, [profile.country]);

  useEffect(() => {
    const fetchUniversityCity = async () => {
      if (!profile.university) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('universities')
          .select('city')
          .eq('name', profile.university)
          .single();

        if (error) throw error;
        setUniversityCity(data?.city || null);
      } catch (error) {
        console.error("Error fetching university city:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityCity();
  }, [profile.university]);

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="overflow-hidden card-hover border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <div className="h-24 bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple"></div>
      <div className="-mt-12 flex justify-center">
        <Avatar className="h-24 w-24 border-4 border-white shadow-md ring-2 ring-white/50 group-hover:scale-105 transition-all duration-300">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="text-lg bg-gradient-to-br from-blue-100 to-purple-100 text-erasmatch-blue">
            {getInitials(profile.name)}
          </AvatarFallback>
        </Avatar>
      </div>
      <CardContent className="pt-4 text-center">
        <h3 className="font-semibold text-lg text-gray-900 mt-4 flex items-center justify-center">
          {profile.name || "Anonymous Student"} <span className="ml-2">{countryEmoji}</span>
        </h3>
        <p className="text-xs text-gray-500 mt-1 flex items-center justify-center space-x-1">
          <span>{getInterestEmojis()}</span>
        </p>
        <div className="mt-4 space-y-3">
          {profile.home_university && (
            <div className="flex items-center justify-center text-sm text-gray-600">
              <Home className="h-4 w-4 mr-2 text-erasmatch-purple opacity-70" />
              <span>{profile.home_university}</span>
            </div>
          )}
          <div className="flex items-center justify-center text-sm text-gray-600">
            <School className="h-4 w-4 mr-2 text-erasmatch-blue opacity-70" />
            <span>{profile.university || "University not specified"}</span>
          </div>
          <div className="flex items-center justify-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-erasmatch-green opacity-70" />
            {loading ? (
              <span className="text-gray-400">Loading city...</span>
            ) : universityCity ? (
              <span>{universityCity}</span>
            ) : (
              <span className="text-gray-400">Destination city not available</span>
            )}
          </div>
          <div className="flex items-center justify-center text-sm text-gray-600">
            <CalendarClock className="h-4 w-4 mr-2 text-erasmatch-purple opacity-70" />
            <span>{profile.semester || "Semester not specified"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1 flex justify-center space-x-2">
        <Link to={`/messages?user=${profile.id}`} className="w-1/2">
          <Button variant="outline" className="w-full button-hover group-hover:bg-blue-50 transition-colors">
            <Mail className="mr-1 h-4 w-4" /> Message
          </Button>
        </Link>
        <Link to={`/profile/${profile.id}`} className="w-1/2">
          <Button className="w-full button-hover bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple hover:from-erasmatch-purple hover:to-erasmatch-blue">
            <Globe className="mr-1 h-4 w-4" /> Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default StudentCard;
