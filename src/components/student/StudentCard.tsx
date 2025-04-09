
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { School, MapPin, CalendarClock } from "lucide-react";
import { Profile } from "@/types";

interface StudentCardProps {
  profile: Profile;
}

const StudentCard = ({ profile }: StudentCardProps) => {
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
    <Card className="overflow-hidden card-hover border-gray-100">
      <div className="h-24 bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple"></div>
      <div className="-mt-12 flex justify-center">
        <Avatar className="h-24 w-24 border-4 border-white shadow-md">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="text-lg bg-gradient-to-br from-blue-100 to-purple-100 text-erasmatch-blue">
            {getInitials(profile.name)}
          </AvatarFallback>
        </Avatar>
      </div>
      <CardContent className="pt-4 text-center">
        <h3 className="font-semibold text-lg text-gray-900 mt-4">{profile.name || "Anonymous Student"}</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <School className="h-4 w-4 mr-2 text-erasmatch-blue opacity-70" />
            <span>{profile.university || "University not specified"}</span>
          </div>
          <div className="flex items-center justify-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-erasmatch-green opacity-70" />
            <span>{profile.city || "City not specified"}</span>
          </div>
          <div className="flex items-center justify-center text-sm text-gray-600">
            <CalendarClock className="h-4 w-4 mr-2 text-erasmatch-purple opacity-70" />
            <span>{profile.semester || "Semester not specified"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1 flex justify-center">
        <Link to={`/profile/${profile.id}`}>
          <Button variant="outline" className="button-hover">View Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default StudentCard;
