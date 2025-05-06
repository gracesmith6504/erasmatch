
import { Home, School, MapPin, CalendarClock, BookOpen } from "lucide-react";
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
        {profile.home_university && (
          <div className="flex items-center text-gray-700">
            <Home className="h-5 w-5 mr-2 text-erasmatch-purple" />
            <span>{profile.home_university}</span>
          </div>
        )}
        {profile.course && (
          <div className="flex items-center text-gray-700">
            <BookOpen className="h-5 w-5 mr-2 text-erasmatch-purple" />
            <span>{profile.course}</span>
          </div>
        )}
        {profile.university && (
          <div className="flex items-center text-gray-700">
            <School className="h-5 w-5 mr-2 text-erasmatch-blue" />
            <span>{profile.university}</span>
          </div>
        )}
        {profile.university && !isLoadingCity && universityCity && (
          <div className="flex items-center text-gray-700">
            <MapPin className="h-5 w-5 mr-2 text-erasmatch-blue" />
            <span>{universityCity}</span>
          </div>
        )}
        {profile.semester && (
          <div className="flex items-center text-gray-700">
            <CalendarClock className="h-5 w-5 mr-2 text-erasmatch-blue" />
            <span>{profile.semester}</span>
          </div>
        )}
        
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
