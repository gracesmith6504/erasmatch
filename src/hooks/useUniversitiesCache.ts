import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { University } from "@/components/university/types";

// In-memory cache
let universitiesCache: University[] | null = null;
let inFlightFetch: Promise<University[]> | null = null;
let lastFetchTime = 0;
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes
const PAGE_SIZE = 1000; // PostgREST hard cap per request

export function clearUniversitiesCache() {
  universitiesCache = null;
  lastFetchTime = 0;
  inFlightFetch = null;
}

async function fetchAllUniversities(): Promise<University[]> {
  // Page 0 first to discover total count, then fetch remaining pages in parallel.
  const first = await supabase
    .from("universities")
    .select("id, name, city, country", { count: "exact" })
    .order("name")
    .range(0, PAGE_SIZE - 1);

  if (first.error) throw first.error;
  const total = first.count ?? first.data?.length ?? 0;

  const pages: Array<{ id: number; name: string | null; city: string | null; country: string | null }[]> = [
    first.data ?? [],
  ];

  if (total > PAGE_SIZE) {
    const requests: Promise<typeof first>[] = [];
    for (let from = PAGE_SIZE; from < total; from += PAGE_SIZE) {
      requests.push(
        supabase
          .from("universities")
          .select("id, name, city, country", { count: "exact" })
          .order("name")
          .range(from, from + PAGE_SIZE - 1) as unknown as Promise<typeof first>
      );
    }
    const results = await Promise.all(requests);
    for (const r of results) {
      if (r.error) throw r.error;
      pages.push(r.data ?? []);
    }
  }

  const rows = pages.flat();
  return rows.map((uni) => ({
    id: uni.id,
    name: uni.name || "",
    city: uni.city || null,
    country: uni.country || null,
  })) as University[];
}

export function useUniversitiesCache() {
  const [universities, setUniversities] = useState<University[]>(universitiesCache ?? []);
  const [loading, setLoading] = useState(!universitiesCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const now = Date.now();
      if (universitiesCache && now - lastFetchTime < CACHE_EXPIRY) {
        setUniversities(universitiesCache);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        if (!inFlightFetch) {
          inFlightFetch = fetchAllUniversities()
            .then((rows) => {
              universitiesCache = rows;
              lastFetchTime = Date.now();
              return rows;
            })
            .finally(() => {
              // Allow subsequent refreshes after cache expiry.
              setTimeout(() => {
                inFlightFetch = null;
              }, 0);
            });
        }
        const rows = await inFlightFetch;
        if (!cancelled) setUniversities(rows);
      } catch (err: any) {
        console.error("Error fetching universities:", err);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    universities,
    loading,
    error,
    clearCache: clearUniversitiesCache,
  };
}
