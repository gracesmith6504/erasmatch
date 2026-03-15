
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";

interface ProfileViewer {
  profile: Profile;
  viewedAt: string;
}

export const useProfileViewers = (currentUserId: string | null) => {
  const [viewers, setViewers] = useState<ProfileViewer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchViewers = async () => {
      setIsLoading(true);
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: views, error: viewsError } = await supabase
          .from('profile_views')
          .select('viewer_id, viewed_at')
          .eq('viewed_id', currentUserId)
          .gte('viewed_at', thirtyDaysAgo.toISOString())
          .order('viewed_at', { ascending: false })
          .limit(10) as any;

        if (viewsError || !views || views.length === 0) {
          setViewers([]);
          return;
        }

        const viewerIds = views.map((v: any) => v.viewer_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', viewerIds);

        if (profilesError || !profiles) {
          setViewers([]);
          return;
        }

        const profileMap = new Map(profiles.map((p) => [p.id, p as Profile]));
        const result: ProfileViewer[] = views
          .map((v: any) => ({
            profile: profileMap.get(v.viewer_id),
            viewedAt: v.viewed_at,
          }))
          .filter((v: any) => v.profile);

        setViewers(result);
      } catch (err) {
        console.error("Error fetching profile viewers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViewers();
  }, [currentUserId]);

  return { viewers, isLoading };
};

export const recordProfileView = async (viewedId: string) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const authenticatedViewerId = authData.user?.id;

    if (authError || !authenticatedViewerId) {
      console.error("[ProfileView] User not authenticated while recording view", authError);
      return;
    }

    if (authenticatedViewerId === viewedId) return;

    const viewedAt = new Date().toISOString();
    const { error: insertError } = await supabase
      .from('profile_views')
      .insert({
        viewer_id: authenticatedViewerId,
        viewed_id: viewedId,
        viewed_at: viewedAt,
      });

    if (!insertError) return;

    if (insertError.code === '23505') {
      const { error: updateError } = await supabase
        .from('profile_views')
        .update({ viewed_at: viewedAt })
        .eq('viewer_id', authenticatedViewerId)
        .eq('viewed_id', viewedId);

      if (updateError) {
        console.error("[ProfileView] Error updating duplicate view:", updateError);
      }
      return;
    }

    console.error("[ProfileView] Error recording view:", insertError);
  } catch (err) {
    console.error("[ProfileView] Exception recording view:", err);
  }
};
