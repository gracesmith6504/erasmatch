
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/types";

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
    <>
      <div className="bg-gradient-to-r from-erasmatch-blue to-erasmatch-green h-32"></div>
      <div className="px-4 sm:px-6 py-5 relative">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-shrink-0 -mt-16 relative z-10">
              <Avatar className="h-24 w-24 ring-4 ring-white">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-lg bg-erasmatch-light-accent">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            </div>
          </div>

          {isOwnProfile && (
            <div className="mt-6 flex justify-end">
              <Link to="/profile">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
