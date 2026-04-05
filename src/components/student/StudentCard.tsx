import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Profile } from "@/types";
import StudentAvatar from "./card/StudentAvatar";
import StudentCardActions from "./card/StudentCardActions";
import CountryFlag from "./card/CountryFlag";
import { Home, MapPin, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTagInfo } from "@/components/profile/constants";
import { LOOKING_FOR_OPTIONS } from "@/components/profile/components/LookingForSection";
import { format } from "date-fns";

interface StudentCardProps {
  profile: Profile;
  isFeatured?: boolean;
  universityCity?: string | null;
}

const StudentCard = ({ profile, isFeatured = false, universityCity = null }: StudentCardProps) => {
  const tags = profile.personality_tags || [];
  const visibleTags = tags.slice(0, 3);
  const extraCount = tags.length - 3;

  const lookingFor = profile.looking_for || [];
  const visibleLookingFor = lookingFor.slice(0, 3);

  const isNew = new Date().getTime() - new Date(profile.created_at).getTime() < 21 * 24 * 60 * 60 * 1000;

  return (
    <Card className="overflow-hidden border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group min-h-[280px] flex flex-col relative">
      {isNew && (
        <span className="absolute top-2 right-2 z-10 bg-green-500 text-white text-[12px] font-medium px-2 py-0.5 rounded-full">
          Just joined ✨
        </span>
      )}
      <CardContent className="pt-5 pb-3 flex-1 flex flex-col">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3 mb-4">
          <StudentAvatar
            avatarUrl={profile.avatar_url}
            name={profile.name}
            className="h-14 w-14"
            lastActiveAt={profile.last_active_at}
          />
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-1.5 truncate">
              {profile.name || "Anonymous Student"}
              {profile.country && <CountryFlag country={profile.country} />}
            </h3>
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Home className="h-4 w-4 mr-2 shrink-0 text-primary/60" />
            <span className="truncate">{profile.home_university || "Home university not specified"}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 shrink-0 text-primary/60" />
            <span className="truncate">{universityCity || profile.city || "City not specified"}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarClock className="h-4 w-4 mr-2 shrink-0 text-primary/60" />
            <span className="truncate">{profile.semester || "Semester not specified"}</span>
          </div>
          {profile.arrival_date && (
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="mr-2 shrink-0">✈️</span>
              <span className="truncate">Arriving {format(new Date(profile.arrival_date), "d MMM")}</span>
            </div>
          )}
        </div>

        {/* Looking For Tags */}
        {visibleLookingFor.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {visibleLookingFor.map((item) => {
              const info = LOOKING_FOR_OPTIONS.find((o) => o.value === item);
              return (
                <Badge
                  key={item}
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1"
                >
                  🔍 {info?.label || item}
                </Badge>
              );
            })}
          </div>
        )}

        {/* Personality Tags */}
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {visibleTags.map((tag) => {
              const tagInfo = getTagInfo(tag);
              return (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-muted text-muted-foreground border-border text-sm px-3 py-1"
                >
                  {tagInfo?.icon} {tagInfo?.label || tag}
                </Badge>
              );
            })}
            {extraCount > 0 && (
              <Badge variant="outline" className="bg-muted text-muted-foreground/60 border-border text-sm px-3 py-1">
                +{extraCount} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-1 flex justify-center space-x-2">
        <StudentCardActions
          studentId={profile.id}
          studentName={profile.name || "Student"}
          studentCity={profile.city}
          studentUniversity={profile.university}
        />
      </CardFooter>
    </Card>
  );
};

export default StudentCard;
