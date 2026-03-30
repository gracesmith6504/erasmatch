import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

interface CityPayoffProps {
  city: string | null;
  userId: string;
  onComplete: () => void;
}

interface CityProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
}

export const CityPayoff = ({ city, userId, onComplete }: CityPayoffProps) => {
  const [profiles, setProfiles] = useState<CityProfile[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const fetch = async () => {
      if (!city) {
        setLoaded(true);
        return;
      }

      const { count } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("city", city)
        .is("deleted_at", null)
        .neq("id", userId);

      setTotalCount(count ?? 0);

      const { data } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .eq("city", city)
        .is("deleted_at", null)
        .neq("id", userId)
        .order("avatar_url", { ascending: false, nullsFirst: false })
        .limit(3);

      setProfiles(data ?? []);
      setLoaded(true);
    };

    fetch();
  }, [city, userId]);

  // Auto-advance
  useEffect(() => {
    if (!loaded) return;
    const delay = totalCount > 0 ? 6000 : 4000;
    timerRef.current = setTimeout(onComplete, delay);
    return () => clearTimeout(timerRef.current);
  }, [loaded, totalCount, onComplete]);

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (!loaded) return null;

  const hasMatches = totalCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 px-6 text-center max-w-md"
      >
        {hasMatches ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              {totalCount} student{totalCount !== 1 ? "s" : ""} already going to {city} 🎉
            </h1>

            <div className="flex -space-x-3">
              {profiles.map((p) => (
                <Avatar key={p.id} className="h-16 w-16 border-4 border-background shadow-md">
                  {p.avatar_url ? (
                    <AvatarImage src={p.avatar_url} />
                  ) : null}
                  <AvatarFallback className="bg-secondary text-foreground text-sm">
                    {getInitials(p.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>

            <Button size="lg" onClick={onComplete} className="mt-2">
              Meet them <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              You're the first one heading to {city || "your destination"}! 🚀
            </h1>
            <p className="text-muted-foreground">
              More students are joining every day.
            </p>
            <Button size="lg" onClick={onComplete} className="mt-2">
              Explore students <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
};
