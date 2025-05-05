
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Profile } from "@/types";
import StudentAvatar from "./card/StudentAvatar";
import PersonalityTags from "./card/PersonalityTags";
import StudentInfo from "./card/StudentInfo";
import StudentCardActions from "./card/StudentCardActions";
import CountryFlag from "./card/CountryFlag";


interface StudentCardProps {
  profile: Profile;
  isFeatured?: boolean;
}

const StudentCard = ({ profile, isFeatured = false }: StudentCardProps) => {
  return (
    <Card className="overflow-hidden card-hover border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <div className="h-24 bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple"></div>
      <div className="-mt-12 flex justify-center">
        <StudentAvatar 
          avatarUrl={profile.avatar_url}
          name={profile.name}
          className="h-24 w-24"
        />
      </div>
      <CardContent className="pt-4 text-center">
        <h3 className="font-semibold text-lg text-gray-900 mt-4 flex items-center justify-center">
          {profile.name || "Anonymous Student"} 
          {profile.country && <span className="ml-2"><CountryFlag country={profile.country} /></span>}
        </h3>
        
        <PersonalityTags tags={profile.personality_tags} />
        
        <StudentInfo 
          university={profile.university}
          homeUniversity={profile.home_university}
          course={profile.course}
          semester={profile.semester}
        />
      </CardContent>
      <CardFooter className="pt-1 flex justify-center space-x-2">
        <StudentCardActions studentId={profile.id} />
      </CardFooter>
    </Card>
  );
};

export default StudentCard;
