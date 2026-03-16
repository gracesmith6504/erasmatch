import { supabase } from "@/integrations/supabase/client";

/**
 * Attempts to insert a manually entered university into the universities table.
 * Does a case-insensitive duplicate check first.
 * Accepts optional city to enrich the DB entry.
 */
export async function autoAddUniversity(name: string, city?: string): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) return;

  try {
    // Case-insensitive duplicate check
    const { data: existing } = await supabase
      .from("universities")
      .select("id")
      .ilike("name", trimmed)
      .limit(1);

    if (existing && existing.length > 0) {
      // Already exists, skip
      return;
    }

    const insertData: { name: string; city?: string } = { name: trimmed };
    if (city?.trim()) {
      insertData.city = city.trim();
    }

    const { error } = await supabase
      .from("universities")
      .insert(insertData);

    if (error) {
      console.error("Failed to auto-add university:", error);
    } else {
      console.log("Auto-added university:", trimmed, city ? `(${city})` : "");
    }
  } catch (err) {
    console.error("Error auto-adding university:", err);
  }
}
