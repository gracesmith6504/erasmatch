
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/types";
import { Upload } from "lucide-react";

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

  return (
    <div className="text-center px-4 pt-6 pb-4 bg-indigo-50 rounded-b-2xl">
      <Avatar className="w-24 h-24 rounded-full mx-auto text-xl font-bold bg-indigo-200 text-white flex items-center justify-center">
        <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || "Profile"} />
        <AvatarFallback>
          {getInitials(profile.name)}
        </AvatarFallback>
      </Avatar>
      
      <h1 className="text-lg font-semibold mt-2">{profile.name}</h1>
      <p className="text-sm text-gray-500">{profile.email}</p>
      
      {isOwnProfile && (
        <div className="mt-4">
          <Link to="/profile">
            <Button variant="outline" className="text-sm bg-white border border-indigo-200 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 transition">
              <Upload className="h-4 w-4 mr-1" />
              Edit Profile
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
