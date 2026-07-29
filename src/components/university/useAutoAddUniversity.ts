import { supabase } from "@/integrations/supabase/client";
import { clearUniversitiesCache } from "@/hooks/useUniversitiesCache";

// Matches CONFIDENT_MATCH_SCORE in DestinationUniversityStep: alias-prefix tier or higher.
const CONFIDENT_MATCH_SCORE = 600;

/**
 * Attempts to insert a manually entered university into the universities table.
 * First consults the alias-aware `search_universities` RPC so that typing an
 * acronym/translation (e.g. "IEP Bordeaux") resolves to the canonical row
 * instead of creating a duplicate. Falls back to a case-insensitive name check.
 */
export async function autoAddUniversity(name: string, city?: string): Promise<string | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;

  try {
    const { data: hits } = await (supabase as any).rpc("search_universities", {
      _q: trimmed,
      _limit: 1,
      _city: null,
    });
    const top = (hits ?? [])[0] as { id: number; name: string; score: number } | undefined;
    if (top && (top.score ?? 0) >= CONFIDENT_MATCH_SCORE) {
      return top.name;
    }

    const { data: existing } = await supabase
      .from("universities")
      .select("id")
      .ilike("name", trimmed)
      .limit(1);

    if (existing && existing.length > 0) return null;

    const insertData: { name: string; city?: string } = { name: trimmed };
    if (city?.trim()) insertData.city = city.trim();

    const { error } = await supabase.from("universities").insert(insertData);

    if (error) {
      console.error("Failed to auto-add university:", error);
    } else {
      clearUniversitiesCache();
    }
  } catch (err) {
    console.error("Error auto-adding university:", err);
  }
  return null;
}
