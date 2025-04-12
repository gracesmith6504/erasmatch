
import { Home, School, MapPin, CalendarClock } from "lucide-react";
import { Profile } from "@/types";
import { ProfilePersonalityTags } from "./ProfilePersonalityTags";

type ProfileDetailsProps = {
  profile: Profile;
  universityCity: string | null;
  isLoadingCity: boolean;
};

export const ProfileDetails = ({ profile, universityCity, isLoadingCity }: ProfileDetailsProps) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center text-gray-700">
          <Home className="h-5 w-5 mr-2 text-erasmatch-purple" />
          <span>{profile.home_university || "Home university not specified"}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <School className="h-5 w-5 mr-2 text-erasmatch-blue" />
          <span>{profile.university || "University not specified"}</span>
        </div>
        {(profile.university && !isLoadingCity) ? (
          <div className="flex items-center text-gray-700">
            <MapPin className="h-5 w-5 mr-2 text-erasmatch-blue" />
            <span>{universityCity || "Destination city not available"}</span>
          </div>
        ) : isLoadingCity ? (
          <div className="flex items-center text-gray-500">
            <MapPin className="h-5 w-5 mr-2 text-erasmatch-blue" />
            <span>Loading city information...</span>
          </div>
        ) : null}
        <div className="flex items-center text-gray-700">
          <CalendarClock className="h-5 w-5 mr-2 text-erasmatch-blue" />
          <span>{profile.semester || "Semester not specified"}</span>
        </div>
        
        <ProfilePersonalityTags tags={profile.personality_tags} />
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">About</h2>
        <p className="text-gray-700">
          {profile.bio || "No bio information provided."}
        </p>
      </div>
    </div>
  );
};
