
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Profile } from "@/types";
import StudentAvatar from "./card/StudentAvatar";
import PersonalityTags from "./card/PersonalityTags";
import StudentInfo from "./card/StudentInfo";
import StudentCardActions from "./card/StudentCardActions";
import CountryFlag from "./card/CountryFlag";
import { Heart, X, MessageCircle } from "lucide-react";

interface StudentCardProps {
  profile: Profile;
}

const StudentCard = ({ profile }: StudentCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(true);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 800);
  };
  
  return (
    <Card className="overflow-hidden profile-card border-0 transform transition-all hover:-translate-y-2 duration-300 relative">
      {/* Like animation */}
      {showAnimation && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 rounded-2xl animate-pop">
          <div className="bg-white/90 p-3 rounded-full shadow-lg">
            <Heart className="h-10 w-10 text-tinder-red fill-tinder-red" />
          </div>
        </div>
      )}
      
      <div className="h-28 bg-gradient-to-r from-duo-blue to-duo-purple"></div>
      <div className="-mt-12 flex justify-center">
        <StudentAvatar 
          avatarUrl={profile.avatar_url}
          name={profile.name}
          className="h-24 w-24 border-4 border-white shadow-lg"
        />
      </div>
      <CardContent className="pt-4 text-center">
        <h3 className="font-rounded font-bold text-lg text-gray-900 mt-4 flex items-center justify-center">
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
      <CardFooter className="pt-1 flex justify-center space-x-3 pb-4">
        {/* Tinder-style action buttons */}
        <button 
          onClick={(e) => e.preventDefault()}
          className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center shadow-md hover:bg-gray-200 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        <button 
          onClick={handleLike}
          className={`h-14 w-14 ${isLiked ? 'bg-tinder-red' : 'bg-duo-green'} rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all transform hover:scale-105`}
        >
          <Heart className={`h-6 w-6 text-white ${isLiked ? 'fill-white' : ''}`} />
        </button>
        <button 
          onClick={(e) => e.preventDefault()}
          className="h-12 w-12 bg-duo-blue rounded-full flex items-center justify-center shadow-md hover:bg-blue-500 transition-colors"
        >
          <MessageCircle className="h-5 w-5 text-white" />
        </button>
      </CardFooter>
    </Card>
  );
};

export default StudentCard;
