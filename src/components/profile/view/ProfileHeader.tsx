
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/types";
import { Upload } from "lucide-react";
import { useAuth } from "@/contexts/auth";

type ProfileHeaderProps = {
  profile: Profile;
  isOwnProfile: boolean;
};

export const ProfileHeader = ({ profile, isOwnProfile }: ProfileHeaderProps) => {
  const { currentUserEmail } = useAuth();

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get secondary info to display instead of email for non-owners
  const getSecondaryInfo = () => {
    if (isOwnProfile) {
      return currentUserEmail;
    } else if (profile.city) {
      return profile.city;
    } else if (profile.university) {
      return profile.university;
    } else if (profile.home_university) {
      return profile.home_university;
    } else if (profile.course) {
      return profile.course;
    } else {
      return "Erasmus Student";
    }
  };


  return (
    <div className="text-center px-4 pt-5 pb-4 sm:pt-6 sm:pb-5 bg-secondary/50 rounded-b-2xl">
      <Avatar className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto text-xl font-bold bg-primary/10 text-primary flex items-center justify-center ring-4 ring-background">
        <AvatarImage src={profile.avatar_url ? `${profile.avatar_url}?width=240&height=240&resize=cover&quality=80` : undefined} alt={profile.name || "Profile"} decoding="async" />
        <AvatarFallback>
          {getInitials(profile.name)}
        </AvatarFallback>
      </Avatar>

      <h1 className="text-lg sm:text-xl font-display font-semibold mt-3 text-foreground">{profile.name}</h1>
      <p className="text-sm text-muted-foreground mt-0.5">{getSecondaryInfo()}</p>

      {isOwnProfile && (
        <div className="mt-3">
          <Link to="/profile">
            <Button variant="outline" size="sm" className="rounded-full border-border/70 text-sm gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
