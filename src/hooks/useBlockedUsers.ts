import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useBlockedUsers = () => {
  const { currentUserId } = useAuth();
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlockedUsers = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const { data, error } = await supabase
        .from("blocked_users")
        .select("blocked_id")
        .eq("blocker_id", currentUserId);

      if (error) throw error;
      setBlockedIds(data?.map((b) => b.blocked_id) || []);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchBlockedUsers();
  }, [fetchBlockedUsers]);

  const isBlocked = useCallback(
    (userId: string) => blockedIds.includes(userId),
    [blockedIds]
  );

  const blockUser = useCallback(
    async (blockedId: string, reason?: string, reported?: boolean) => {
      if (!currentUserId) return;
      try {
        const { error } = await supabase.from("blocked_users").insert({
          blocker_id: currentUserId,
          blocked_id: blockedId,
          reason: reason || null,
          reported: reported || false,
        });
        if (error) throw error;
        setBlockedIds((prev) => [...prev, blockedId]);
        toast.success(reported ? "User blocked and reported" : "User blocked");
      } catch (error: any) {
        if (error?.code === "23505") {
          toast.info("User is already blocked");
        } else {
          console.error("Error blocking user:", error);
          toast.error("Failed to block user");
        }
      }
    },
    [currentUserId]
  );

  const unblockUser = useCallback(
    async (blockedId: string) => {
      if (!currentUserId) return;
      try {
        const { error } = await supabase
          .from("blocked_users")
          .delete()
          .eq("blocker_id", currentUserId)
          .eq("blocked_id", blockedId);
        if (error) throw error;
        setBlockedIds((prev) => prev.filter((id) => id !== blockedId));
        toast.success("User unblocked");
      } catch (error) {
        console.error("Error unblocking user:", error);
        toast.error("Failed to unblock user");
      }
    },
    [currentUserId]
  );

  const checkIsBlockedBidirectional = useCallback(
    async (otherUserId: string): Promise<boolean> => {
      if (!currentUserId) return false;
      try {
        const { data, error } = await supabase.rpc("is_blocked", {
          user_a: currentUserId,
          user_b: otherUserId,
        });
        if (error) throw error;
        return data || false;
      } catch (error) {
        console.error("Error checking block status:", error);
        return false;
      }
    },
    [currentUserId]
  );

  return {
    blockedIds,
    loading,
    isBlocked,
    blockUser,
    unblockUser,
    checkIsBlockedBidirectional,
    refetch: fetchBlockedUsers,
  };
};
