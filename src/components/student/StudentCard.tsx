
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { School, MapPin, CalendarClock, Home, Globe, Mail, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getTagInfo, getTagBgColor } from "@/components/profile/constants";

interface StudentCardProps {
  profile: Profile;
}

const StudentCard = ({ profile }: StudentCardProps) => {
  const [universityCity, setUniversityCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [countryEmoji, setCountryEmoji] = useState<string>("🌍");
  const [showAllTags, setShowAllTags] = useState(false);
  const navigate = useNavigate();

  // Country emoji mapping (simplified)
  useEffect(() => {
    const getCountryEmoji = () => {
      if (!profile.country) return "🌍";
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

  const handleMessageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Navigate to messages with user ID as URL parameter
    navigate(`/messages?user=${profile.id}`);
    
    // Ensure the page scrolls to top when navigating to messages
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const renderPersonalityTags = () => {
    if (!profile.personality_tags || profile.personality_tags.length === 0) {
      return null;
    }

    // Define the default visible tags
    const defaultVisibleTags = ["looking-to-meet", "weekend-trips", "clubbing"];
    
    // Try to show priority tags first, if they exist in the profile's tags
    const priorityTags = profile.personality_tags.filter(tag => defaultVisibleTags.includes(tag));
    
    // If no priority tags, just show the first 3
    const visibleTags = priorityTags.length > 0 ? priorityTags.slice(0, 3) : profile.personality_tags.slice(0, 3);
    const hiddenTags = profile.personality_tags.filter(tag => !visibleTags.includes(tag));
    const hasMoreTags = hiddenTags.length > 0;

    return (
      <div className="flex flex-col items-center mt-2">
        {/* Always visible tags */}
        <div className="flex flex-wrap justify-center gap-1">
          {visibleTags.map((tag) => {
            const tagInfo = getTagInfo(tag);
            return (
              <Badge key={tag} className={`${getTagBgColor(tag)} text-xs`}>
                {tagInfo?.icon} {tagInfo?.label}
              </Badge>
            );
          })}
        </div>
        
        {/* Hidden tags - visible on desktop or when toggled */}
        {hasMoreTags && (
          <>
            <div className={`${showAllTags ? 'flex' : 'hidden sm:flex'} flex-wrap justify-center gap-1 mt-1`}>
              {hiddenTags.map((tag) => {
                const tagInfo = getTagInfo(tag);
                return (
                  <Badge key={tag} className={`${getTagBgColor(tag)} text-xs`}>
                    {tagInfo?.icon} {tagInfo?.label}
                  </Badge>
                );
              })}
            </div>
            
            {/* Toggle button - only visible on mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllTags(!showAllTags)}
              className="mt-1 text-xs text-blue-600 sm:hidden flex items-center p-0 h-6"
            >
              {showAllTags ? (
                <>Show Less <ChevronUp className="ml-0.5 h-3 w-3" /></>
              ) : (
                <>View {hiddenTags.length} More <ChevronDown className="ml-0.5 h-3 w-3" /></>
              )}
            </Button>
          </>
        )}
      </div>
    );
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
        
        {/* Personality tags */}
        {renderPersonalityTags()}
        
        <div className="mt-4 space-y-3">
          {profile.home_university && (
            <div className="flex items-center justify-center text-sm text-gray-600">
              <Home className="h-4 w-4 mr-2 text-erasmatch-purple opacity-70" />
              <span>{profile.home_university}</span>
            </div>
          )}
          {profile.course && (
            <div className="flex items-center justify-center text-sm text-gray-600">
              <BookOpen className="h-4 w-4 mr-2 text-erasmatch-purple opacity-70" />
              <span>{profile.course}</span>
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
        <Button 
          variant="outline" 
          className="w-1/2 button-hover group-hover:bg-blue-50 transition-colors"
          onClick={handleMessageClick}
        >
          <Mail className="mr-1 h-4 w-4" /> Message
        </Button>
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
