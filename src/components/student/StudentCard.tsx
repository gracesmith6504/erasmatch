
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
}

const StudentCard = ({ profile }: StudentCardProps) => {
  return (
    <Card className="overflow-hidden card-hover border-gray-100 group rounded-xl shadow-soft transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="h-28 bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-2 left-8 w-8 h-8 bg-white/20 rounded-full blur-md"></div>
      </div>
      <div className="-mt-16 flex justify-center">
        <StudentAvatar 
          avatarUrl={profile.avatar_url}
          name={profile.name}
          className="h-32 w-32 border-4 border-white shadow-md ring-2 ring-white/30"
        />
      </div>
      <CardContent className="pt-4 text-center">
        <h3 className="font-display font-semibold text-lg text-gray-900 mt-3 flex items-center justify-center group-hover:text-erasmatch-blue transition-colors duration-200">
          {profile.name || "Anonymous Student"} 
          {profile.country && <span className="ml-2 animate-fade-in"><CountryFlag country={profile.country} /></span>}
        </h3>
        
        <PersonalityTags tags={profile.personality_tags} />
        
        <StudentInfo 
          university={profile.university}
          homeUniversity={profile.home_university}
          course={profile.course}
          semester={profile.semester}
        />
      </CardContent>
      <CardFooter className="pt-1 flex justify-center space-x-2 pb-4">
        <StudentCardActions studentId={profile.id} />
      </CardFooter>
    </Card>
  );
};

export default StudentCard;
