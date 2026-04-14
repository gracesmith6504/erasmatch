import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CityStats {
  studentCount: number;
  universityCount: number;
  universities: { name: string; country: string | null }[];
  avatars: string[];
  loading: boolean;
}

export const useCityLandingData = (cityName: string): CityStats => {
  const [studentCount, setStudentCount] = useState(0);
  const [universityCount, setUniversityCount] = useState(0);
  const [universities, setUniversities] = useState<{ name: string; country: string | null }[]>([]);
  const [avatars, setAvatars] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cityName) return;

    const fetchData = async () => {
      setLoading(true);

      const [statsResult, unisResult, avatarsResult] = await Promise.all([
        supabase.rpc("get_city_stats", { _city_name: cityName }),
        supabase
          .from("universities")
          .select("name, country")
          .eq("city", cityName)
          .order("name"),
        supabase.rpc("get_city_preview_avatars", { _city_name: cityName }),
      ]);

      if (statsResult.data && statsResult.data.length > 0) {
        setStudentCount(Number(statsResult.data[0].student_count));
        setUniversityCount(Number(statsResult.data[0].university_count));
      }

      if (unisResult.data) {
        setUniversities(unisResult.data);
      }

      if (avatarsResult.data) {
        setAvatars(avatarsResult.data.map((r: { avatar_url: string }) => r.avatar_url));
      }

      setLoading(false);
    };

    fetchData();
  }, [cityName]);

  return { studentCount, universityCount, universities, avatars, loading };
};
