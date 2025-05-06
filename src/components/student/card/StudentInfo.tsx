
import React, { useState, useEffect } from "react";
import { Home, School, MapPin, CalendarClock, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StudentInfoProps {
  university: string | null;
  homeUniversity: string | null;
  course: string | null;
  semester: string | null;
}

const StudentInfo: React.FC<StudentInfoProps> = ({ 
  university, 
  homeUniversity, 
  course, 
  semester 
}) => {
  const [universityCity, setUniversityCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversityCity = async () => {
      if (!university) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('universities')
          .select('city')
          .eq('name', university)
          .single();

        if (error) throw error;
        setUniversityCity(data?.city || null);
      } catch (error) {
        console.error("Error fetching university city:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityCity();
  }, [university]);

  return (
    <div className="mt-4 space-y-3">
      {homeUniversity && (
        <div className="flex items-center justify-center text-sm text-gray-600">
          <Home className="h-4 w-4 mr-2 text-erasmatch-purple opacity-70" />
          <span>{homeUniversity}</span>
        </div>
      )}
      {course && (
        <div className="flex items-center justify-center text-sm text-gray-600">
          <BookOpen className="h-4 w-4 mr-2 text-erasmatch-purple opacity-70" />
          <span>{course}</span>
        </div>
      )}
      {university && (
        <div className="flex items-center justify-center text-sm text-gray-600">
          <School className="h-4 w-4 mr-2 text-erasmatch-blue opacity-70" />
          <span>{university}</span>
        </div>
      )}
      {!loading && universityCity && (
        <div className="flex items-center justify-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2 text-erasmatch-green opacity-70" />
          <span>{universityCity}</span>
        </div>
      )}
      {semester && (
        <div className="flex items-center justify-center text-sm text-gray-600">
          <CalendarClock className="h-4 w-4 mr-2 text-erasmatch-purple opacity-70" />
          <span>{semester}</span>
        </div>
      )}
    </div>
  );
};

export default StudentInfo;
