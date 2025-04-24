
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/types";
import { Upload, MessageSquare, UserPlus } from "lucide-react";

type ProfileHeaderProps = {
  profile: Profile;
  isOwnProfile: boolean;
};

export const ProfileHeader = ({ profile, isOwnProfile }: ProfileHeaderProps) => {
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
      return profile.email;
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
    <div className="relative">
      {/* Background header gradient */}
      <div className="h-36 bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple rounded-b-3xl"></div>
      
      {/* Profile content */}
      <div className="px-4 pb-6 -mt-16 flex flex-col items-center relative z-10">
        <Avatar className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || "Profile"} />
          <AvatarFallback className="bg-gradient-to-br from-erasmatch-blue to-erasmatch-purple text-white text-xl font-bold">
            {getInitials(profile.name)}
          </AvatarFallback>
        </Avatar>
        
        <h1 className="text-xl font-semibold mt-4 font-display">{profile.name || "Anonymous Student"}</h1>
        <p className="text-sm text-gray-500 mb-2">{getSecondaryInfo()}</p>
        
        {isOwnProfile ? (
          <Link to="/profile">
            <Button variant="outline" className="mt-2 bg-white border border-gray-200 text-erasmatch-blue hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        ) : (
          <div className="flex gap-2 mt-2">
            <Link to={`/messages?user=${profile.id}`}>
              <Button variant="gradient" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                Message
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="bg-white border border-gray-200">
              <UserPlus className="h-4 w-4 mr-1" />
              Connect
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
