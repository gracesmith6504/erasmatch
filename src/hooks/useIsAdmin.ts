import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useIsAdmin() {
  const { currentUserId } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!currentUserId) {
      setIsAdmin(false);
      return;
    }

    const check = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", currentUserId)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!data);
    };

    check();
  }, [currentUserId]);

  return isAdmin;
}
