import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Profile } from "@/types";
import StudentAvatar from "./card/StudentAvatar";
import PersonalityTags from "./card/PersonalityTags";
import StudentCardActions from "./card/StudentCardActions";
import CountryFlag from "./card/CountryFlag";
import { School, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StudentCardProps {
  profile: Profile;
  isFeatured?: boolean;
}

const StudentCard = ({ profile, isFeatured = false }: StudentCardProps) => {
  const [universityCity, setUniversityCity] = useState<string | null>(null);

  useEffect(() => {
    const fetchCity = async () => {
      if (!profile.university) return;
      try {
        const { data } = await supabase
          .from('universities')
          .select('city')
          .eq('name', profile.university)
          .single();
        setUniversityCity(data?.city || null);
      } catch {}
    };
    fetchCity();
  }, [profile.university]);

  return (
    <Card className="overflow-hidden border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
      <CardContent className="pt-5 pb-3">
        {/* Avatar + Name row */}
        <div className="flex items-center gap-3 mb-4">
          <StudentAvatar 
            avatarUrl={profile.avatar_url}
            name={profile.name}
            className="h-14 w-14"
          />
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-1.5 truncate">
              {profile.name || "Anonymous Student"}
              {profile.country && <CountryFlag country={profile.country} />}
            </h3>
          </div>
        </div>

        {/* University & City */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <School className="h-4 w-4 mr-2 shrink-0 text-primary/60" />
            <span className="truncate">{profile.university || "University not specified"}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 shrink-0 text-primary/60" />
            <span className="truncate">{universityCity || profile.city || "City not available"}</span>
          </div>
        </div>

        {/* Personality Tags */}
        <PersonalityTags tags={profile.personality_tags} />
      </CardContent>
      <CardFooter className="pt-1 flex justify-center space-x-2">
        <StudentCardActions studentId={profile.id} />
      </CardFooter>
    </Card>
  );
};

export default StudentCard;
