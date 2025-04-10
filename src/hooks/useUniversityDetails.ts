
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { University } from "@/components/university/types";
import { Profile } from "@/types";

export function useUniversityDetails(universityId: string | undefined) {
  const [university, setUniversity] = useState<University | null>(null);
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversityData = async () => {
      if (!universityId) return;
      
      try {
        setLoading(true);
        
        // Fetch university details - convert string ID to number
        const { data: universityData, error: universityError } = await supabase
          .from('universities')
          .select('*')
          .eq('id', parseInt(universityId))
          .single();
        
        if (universityError) {
          throw universityError;
        }
        
        // Convert the JSON links to the expected format
        let formattedLinks = null;
        
        if (universityData.links && typeof universityData.links === 'object') {
          const linksObj = universityData.links as Record<string, unknown>;
          formattedLinks = {
            housing: linksObj.housing as string | undefined,
            transport: linksObj.transport as string | undefined,
            student_groups: linksObj.student_groups as string | undefined
          };
        }
        
        // Creating a properly typed University object
        const universityWithFormattedLinks: University = {
          id: universityData.id,
          name: universityData.name,
          city: universityData.city,
          country: universityData.country,
          description: null, // This property might not exist in the database
          overview: universityData.overview || null,
          erasmus_tips: universityData.erasmus_tips || null,
          accommodation_info: universityData.accommodation_info || null,
          popular_courses: universityData.popular_courses || null,
          image_url: universityData.image_url || null,
          links: formattedLinks,
          student_count: 0 // Will be updated with the count of students
        };
        
        setUniversity(universityWithFormattedLinks);
        
        // Fetch students for this university
        const { data: studentsData, error: studentsError } = await supabase
          .from('profiles')
          .select('*')
          .ilike('university', universityData.name);
        
        if (studentsError) {
          throw studentsError;
        }
        
        // Add the home_university property if it's missing
        const studentsWithHomeUniversity = studentsData.map(student => ({
          ...student,
          home_university: student.home_university || null
        })) as Profile[];
        
        setStudents(studentsWithHomeUniversity);
        
        // Update the university with the correct student count
        setUniversity(prev => prev ? {
          ...prev,
          student_count: studentsWithHomeUniversity.length
        } : null);
        
      } catch (err: any) {
        console.error("Error fetching university details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUniversityData();
  }, [universityId]);
  
  return {
    university,
    students,
    loading,
    error
  };
}
