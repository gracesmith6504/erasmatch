import { supabase } from "@/integrations/supabase/client";

/**
 * Attempts to insert a manually entered university into the universities table.
 * Does a case-insensitive duplicate check first.
 */
export async function autoAddUniversity(name: string): Promise<void> {
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

    const { error } = await supabase
      .from("universities")
      .insert({ name: trimmed });

    if (error) {
      console.error("Failed to auto-add university:", error);
    } else {
      console.log("Auto-added university:", trimmed);
    }
  } catch (err) {
    console.error("Error auto-adding university:", err);
  }
}
