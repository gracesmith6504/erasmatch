
import { Link } from "react-router-dom";
import { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { School, MapPin, CalendarClock } from "lucide-react";

interface StudentListProps {
  students: Profile[];
}

const StudentList = ({ students }: StudentListProps) => {
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (students.length === 0) {
    return (
      <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg text-center">
        <p className="text-gray-600">No students found for this destination yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Students at this university:</h3>
      <div className="grid grid-cols-1 gap-4">
        {students.map((student) => (
          <div 
            key={student.id} 
            className="flex flex-col sm:flex-row items-center bg-white border border-gray-200 p-4 rounded-lg gap-4"
          >
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarImage src={student.avatar_url || undefined} />
              <AvatarFallback className="text-lg bg-erasmatch-light-accent">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-grow text-center sm:text-left">
              <h4 className="font-semibold">{student.name || "Name not specified"}</h4>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center justify-center sm:justify-start text-gray-600">
                  <School className="h-4 w-4 mr-2" />
                  <span>{student.university || "University not specified"}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{student.city || "City not specified"}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start text-gray-600">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  <span>{student.semester || "Semester not specified"}</span>
                </div>
              </div>
            </div>
            
            <Link to={`/profile/${student.id}`} className="mt-3 sm:mt-0">
              <Button variant="outline" size="sm">View Profile</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
