import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LandingProfile {
  first_name: string;
  avatar_url: string;
  city: string;
}

const fallbackProfiles: LandingProfile[] = [
  { first_name: "Emma", avatar_url: "", city: "Barcelona" },
  { first_name: "Matteo", avatar_url: "", city: "Budapest" },
  { first_name: "Annika", avatar_url: "", city: "Madrid" },
  { first_name: "Jules", avatar_url: "", city: "Bordeaux" },
  { first_name: "Petra", avatar_url: "", city: "Vienna" },
  { first_name: "Sofia", avatar_url: "", city: "Lisbon" },
];

export const RealStudentGrid = () => {
  const [profiles, setProfiles] = useState<LandingProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase.rpc("get_landing_page_profiles");
      if (error || !data || data.length === 0) {
        setProfiles(fallbackProfiles);
      } else {
        setProfiles(data as LandingProfile[]);
      }
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  const grouped = profiles.reduce<Record<string, LandingProfile[]>>((acc, p) => {
    if (!acc[p.city]) acc[p.city] = [];
    acc[p.city].push(p);
    return acc;
  }, {});

  const cities = Object.entries(grouped).slice(0, 4);

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-card rounded-2xl p-5 shadow-card border border-border animate-pulse h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {cities.map(([city, students], cityIndex) => (
        <motion.div
          key={city}
          className="bg-card rounded-2xl p-5 shadow-card border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + cityIndex * 0.15, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-foreground">{city}</p>
            <span className="text-xs text-muted-foreground">
              {students.length} {students.length === 1 ? "student" : "students"}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {students.map((student, i) => (
              <motion.div
                key={`${city}-${i}`}
                className="flex flex-col items-center gap-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + cityIndex * 0.15 + i * 0.08, duration: 0.3 }}
              >
                <Avatar className="h-10 w-10 border-2 border-card shadow-soft">
                  {student.avatar_url ? <AvatarImage src={student.avatar_url} loading="lazy" /> : null}
                  <AvatarFallback className="text-xs bg-secondary text-foreground">
                    {student.first_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[10px] text-muted-foreground truncate max-w-[48px]">{student.first_name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
