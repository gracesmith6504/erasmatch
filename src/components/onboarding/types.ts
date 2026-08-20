import type { Database } from "@/integrations/supabase/types";

export type ProfileUpdate = Partial<Database["public"]["Tables"]["profiles"]["Update"]>;
