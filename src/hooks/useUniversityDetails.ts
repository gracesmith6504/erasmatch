
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
        const universityWithFormattedLinks: University = {
          ...universityData,
          links: universityData.links ? {
            housing: universityData.links.housing,
            transport: universityData.links.transport,
            student_groups: universityData.links.student_groups
          } : null
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
        
        setStudents(studentsData || []);
        
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
