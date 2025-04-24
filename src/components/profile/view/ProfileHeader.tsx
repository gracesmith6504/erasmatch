
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
      {/* Background header gradient with decorative elements */}
      <div className="h-40 bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple rounded-b-3xl relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-6 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-white/10 rounded-full blur-md"></div>
      </div>
      
      {/* Profile content */}
      <div className="px-4 pb-6 -mt-20 flex flex-col items-center relative z-10">
        <Avatar className="w-36 h-36 rounded-full border-4 border-white shadow-lg bg-white ring-4 ring-white/30 transition-all hover:shadow-xl">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || "Profile"} />
          <AvatarFallback className="bg-gradient-to-br from-erasmatch-blue to-erasmatch-purple text-white text-2xl font-bold">
            {getInitials(profile.name)}
          </AvatarFallback>
        </Avatar>
        
        <h1 className="text-2xl font-semibold mt-5 font-display">{profile.name || "Anonymous Student"}</h1>
        <p className="text-sm text-gray-500 mb-3">{getSecondaryInfo()}</p>
        
        {isOwnProfile ? (
          <Link to="/profile">
            <Button variant="soft" className="mt-2 border border-gray-200 text-erasmatch-blue hover:bg-blue-50">
              <Upload className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        ) : (
          <div className="flex gap-3 mt-2">
            <Link to={`/messages?user=${profile.id}`}>
              <Button variant="gradient" size="sm" className="shadow-md hover:shadow-lg transition-all">
                <MessageSquare className="h-4 w-4 mr-1" />
                Message
              </Button>
            </Link>
            <Button variant="soft" size="sm" className="bg-white border border-gray-200">
              <UserPlus className="h-4 w-4 mr-1" />
              Connect
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
