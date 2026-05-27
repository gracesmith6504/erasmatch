import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUniversitiesCache } from "./useUniversitiesCache";
import { buildResolver, type AliasRow, type UniversityResolver } from "@/lib/universityResolver";

// Module-level alias cache mirrors useUniversitiesCache's strategy.
let aliasesCache: AliasRow[] | null = null;
let aliasesFetchedAt = 0;
const CACHE_EXPIRY = 15 * 60 * 1000;

export function useUniversityResolver(): { resolver: UniversityResolver; ready: boolean } {
  const { universities, loading: unisLoading } = useUniversitiesCache();
  const [aliases, setAliases] = useState<AliasRow[]>(aliasesCache ?? []);
  const [aliasesLoading, setAliasesLoading] = useState(!aliasesCache);

  useEffect(() => {
    const now = Date.now();
    if (aliasesCache && now - aliasesFetchedAt < CACHE_EXPIRY) {
      setAliases(aliasesCache);
      setAliasesLoading(false);
      return;
    }
    supabase
      .from("university_aliases")
      .select("alias, university_id")
      .then(({ data }) => {
        const rows = (data as AliasRow[]) || [];
        aliasesCache = rows;
        aliasesFetchedAt = Date.now();
        setAliases(rows);
        setAliasesLoading(false);
      });
  }, []);

  const resolver = buildResolver(universities, aliases);
  return { resolver, ready: !unisLoading && !aliasesLoading };
}
