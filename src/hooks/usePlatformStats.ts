import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PlatformStats {
  studentCount: number;
  countryCount: number;
  messageCount: number;
}

/**
 * Fetches live platform-wide stats (student count, country count, message count)
 * and rounds them down to the nearest milestone for display (e.g. 1,050 → "1,000+").
 *
 * Results are cached in sessionStorage for the duration of the tab so repeated
 * navigations back to the homepage don't re-query.
 */
export const usePlatformStats = () => {
  const [stats, setStats] = useState<PlatformStats | null>(() => {
    const cached = sessionStorage.getItem("platform-stats");
    if (cached) {
      try {
        return JSON.parse(cached) as PlatformStats;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(!stats);

  useEffect(() => {
    if (stats) return; // already have cached data

    const fetchStats = async () => {
      try {
        const [profilesRes, countriesRes, messagesRes] = await Promise.all([
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("universities")
            .select("country_code")
            .not("country_code", "is", null),
          supabase
            .from("messages")
            .select("id", { count: "exact", head: true }),
        ]);

        // Bail on any query error so we never cache bad data
        if (profilesRes.error) throw profilesRes.error;
        if (countriesRes.error) throw countriesRes.error;
        if (messagesRes.error) throw messagesRes.error;

        const studentCount = profilesRes.count ?? 0;
        const messageCount = messagesRes.count ?? 0;

        // Count distinct countries from universities that have students
        const uniqueCountries = new Set(
          (countriesRes.data ?? []).map((u) => u.country_code)
        );
        const countryCount = uniqueCountries.size;

        const result: PlatformStats = { studentCount, countryCount, messageCount };
        sessionStorage.setItem("platform-stats", JSON.stringify(result));
        setStats(result);
      } catch (err) {
        console.error("Failed to fetch platform stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [stats]);

  return { stats, loading };
};

/**
 * Formats a number as a rounded-down milestone string.
 * e.g. 1,050 → "1,000+", 347 → "300+", 52 → "50+"
 */
export const formatStatDisplay = (n: number): string => {
  if (n >= 1000) {
    const rounded = Math.floor(n / 100) * 100;
    return `${rounded.toLocaleString("en-US")}+`;
  }
  if (n >= 100) {
    const rounded = Math.floor(n / 50) * 50;
    return `${rounded}+`;
  }
  if (n >= 10) {
    const rounded = Math.floor(n / 10) * 10;
    return `${rounded}+`;
  }
  return `${n}`;
};
