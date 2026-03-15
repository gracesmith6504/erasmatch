
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

export const recordProfileView = async (viewerId: string, viewedId: string) => {
  if (viewerId === viewedId) return;
  try {
    await (supabase.from('profile_views') as any).upsert(
      { viewer_id: viewerId, viewed_id: viewedId, viewed_at: new Date().toISOString() },
      { onConflict: 'viewer_id,viewed_id' }
    );
  } catch (err) {
    // Silently ignore — dedup or RLS errors are expected
  }
};
