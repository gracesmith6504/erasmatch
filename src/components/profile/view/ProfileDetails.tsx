import { Link } from "react-router-dom";
import { Home, School, MapPin, CalendarClock, BookOpen, Sparkles } from "lucide-react";
import { Profile } from "@/types";
import { ProfilePersonalityTags } from "./ProfilePersonalityTags";

type ProfileDetailsProps = {
  profile: Profile;
  universityCity: string | null;
  isLoadingCity: boolean;
  isOwnProfile?: boolean;
};

export const ProfileDetails = ({ profile, universityCity, isLoadingCity, isOwnProfile = false }: ProfileDetailsProps) => {
  const hasBio = !!(profile.bio && profile.bio.trim().length > 0);

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center text-gray-700">
          <Home className="h-5 w-5 mr-2 text-erasmatch-purple" />
          <span>{profile.home_university || "Home university not specified"}</span>
        </div>
        {profile.course && (
          <div className="flex items-center text-gray-700">
            <BookOpen className="h-5 w-5 mr-2 text-erasmatch-purple" />
            <span>{profile.course}</span>
          </div>
        )}
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

      {/* About — hide entirely from other viewers when empty; nudge owner to add one */}
      {hasBio ? (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">About</h2>
          <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
        </div>
      ) : isOwnProfile ? (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">About</h2>
          <Link
            to="/profile"
            className="group block rounded-2xl border border-dashed border-border bg-secondary/40 p-4 text-sm text-muted-foreground hover:bg-secondary/70 hover:text-foreground transition-colors"
          >
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Add a short bio
            </div>
            <p className="mt-1">
              A 1-sentence intro helps you stand out. Profiles with a bio get noticeably more connects.
            </p>
          </Link>
        </div>
      ) : null}
    </div>
  );
};
