import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CityStats {
  studentCount: number;
  universityCount: number;
  universities: { name: string; country: string | null }[];
  loading: boolean;
}

export const useCityLandingData = (cityName: string): CityStats => {
  const [studentCount, setStudentCount] = useState(0);
  const [universityCount, setUniversityCount] = useState(0);
  const [universities, setUniversities] = useState<{ name: string; country: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cityName) return;

    const fetchData = async () => {
      setLoading(true);

      const [statsResult, unisResult] = await Promise.all([
        supabase.rpc("get_city_stats", { _city_name: cityName }),
        supabase
          .from("universities")
          .select("name, country")
          .eq("city", cityName)
          .order("name"),
      ]);

      if (statsResult.data && statsResult.data.length > 0) {
        setStudentCount(Number(statsResult.data[0].student_count));
        setUniversityCount(Number(statsResult.data[0].university_count));
      }

      if (unisResult.data) {
        setUniversities(unisResult.data);
      }

      setLoading(false);
    };

    fetchData();
  }, [cityName]);

  return { studentCount, universityCount, universities, loading };
};
