
import { Link } from "react-router-dom";
import { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { School, MapPin, CalendarClock } from "lucide-react";
import { getTagInfo, getTagBgColor } from "@/components/profile/constants";

interface StudentListProps {
  students: Profile[];
}

const StudentList = ({ students }: StudentListProps) => {
  // Filter out deleted users
  const activeStudents = students.filter(student => !student.deleted_at);

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const renderPersonalityTags = (profile: Profile) => {
    if (!profile.personality_tags || profile.personality_tags.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {profile.personality_tags.slice(0, 2).map((tag) => {
          const tagInfo = getTagInfo(tag);
          return (
            <Badge key={tag} className={`${getTagBgColor(tag)} text-xs`}>
              {tagInfo?.icon} {tagInfo?.label}
            </Badge>
          );
        })}
        {profile.personality_tags.length > 2 && (
          <Badge className="bg-gray-100 text-gray-700 text-xs">
            +{profile.personality_tags.length - 2} more
          </Badge>
        )}
      </div>
    );
  };

  if (activeStudents.length === 0) {
    return (
      <div className="mt-4 p-6 bg-gray-50 border border-gray-100 rounded-xl text-center">
        <p className="text-gray-600">No students found for this destination yet.</p>
        <p className="text-sm text-gray-500 mt-1">Be the first to update your profile with this university!</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Students at this university</h3>
        <span className="text-sm text-gray-500">{activeStudents.length} student(s)</span>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {activeStudents.map((student) => (
          <div 
            key={student.id} 
            className="flex flex-col sm:flex-row items-center bg-white border border-gray-100 p-4 rounded-xl gap-4 hover:shadow-soft transition-all duration-300"
          >
            <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
              {student.avatar_url ? (
                <AvatarImage 
                  src={student.avatar_url || undefined}
                  loading="lazy" // Add lazy loading for avatars
                />
              ) : null}
              <AvatarFallback className="text-lg bg-gradient-to-br from-blue-100 to-purple-100 text-erasmatch-blue">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-grow text-center sm:text-left">
              <h4 className="font-semibold text-gray-900">{student.name || "Name not specified"}</h4>
              
              {/* Display personality tags */}
              <div className="mt-1 sm:mt-1 flex justify-center sm:justify-start">
                {renderPersonalityTags(student)}
              </div>
              
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center justify-center sm:justify-start text-gray-600">
                  <School className="h-4 w-4 mr-2 text-erasmatch-blue opacity-70" />
                  <span>{student.university || "University not specified"}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-erasmatch-green opacity-70" />
                  <span>{student.city || "City not specified"}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start text-gray-600">
                  <CalendarClock className="h-4 w-4 mr-2 text-erasmatch-purple opacity-70" />
                  <span>{student.semester || "Semester not specified"}</span>
                </div>
              </div>
            </div>
            
            <Link to={`/profile/${student.id}`} className="mt-3 sm:mt-0">
              <Button variant="outline" size="sm" className="button-hover">
                View Profile
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
