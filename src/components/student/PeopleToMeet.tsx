import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { X, Sparkles } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTagInfo, getTagBgColor } from "@/components/profile/constants";
import ConnectModal from "@/components/student/ConnectModal";
import { useNavigate } from "react-router-dom";
import { recordProfileView } from "@/hooks/useProfileViewers";

interface PeopleToMeetProps {
  profiles: Profile[];
  currentUserId: string;
  currentProfile: Profile;
}

const STORAGE_KEY = "peopleToMeetDismissed";

const PeopleToMeet: React.FC<PeopleToMeetProps> = ({
  profiles,
  currentUserId,
  currentProfile,
}) => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true"
  );
  const [connectTarget, setConnectTarget] = useState<{
    id: string;
    name: string;
    initialNote: string;
  } | null>(null);

  // Fetch IDs of users already messaged
  const { data: messagedIds = [] } = useQuery({
    queryKey: ["messaged-users", currentUserId],
    queryFn: async () => {
      const { data } = await supabase
        .from("messages")
        .select("sender_id, receiver_id")
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);
      if (!data) return [];
      const ids = new Set<string>();
      data.forEach((m) => {
        if (m.sender_id !== currentUserId) ids.add(m.sender_id);
        if (m.receiver_id !== currentUserId) ids.add(m.receiver_id);
      });
      return Array.from(ids);
    },
    staleTime: 60_000,
  });

  const scored = useMemo(() => {
    const myCity = currentProfile.city;
    const myUni = currentProfile.university;
    const mySemester = currentProfile.semester;
    const myTags = currentProfile.personality_tags ?? [];
    const excludeSet = new Set([currentUserId, ...messagedIds]);

    return profiles
      .filter((p) => !excludeSet.has(p.id) && !p.deleted_at)
      .map((p) => {
        let score = 0;
        if (myCity && p.city === myCity) score += 10;
        if (myUni && p.university === myUni) score += 8;
        if (mySemester && p.semester === mySemester) score += 6;
        const pTags = p.personality_tags ?? [];
        const shared = myTags.filter((t) => pTags.includes(t));
        score += shared.length * 3;
        if (p.avatar_url) score += 2;
        return { profile: p, score, sharedTags: shared };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [profiles, currentUserId, currentProfile, messagedIds]);

  if (dismissed || scored.length === 0) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const handleSayHi = (p: Profile) => {
    const firstName = p.name?.split(" ")[0] ?? "there";
    const city = currentProfile.city;
    let note = city
      ? `Hey ${firstName}! I saw we're both going to ${city} — are you excited yet? 😄`
      : `Hey ${firstName}! Let's connect 👋`;
    if (note.length > 100) note = note.slice(0, 97) + "…";
    setConnectTarget({ id: p.id, name: p.name ?? "Student", initialNote: note });
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <>
      <div className="mb-6 rounded-xl bg-primary/5 border border-primary/10 p-4 sm:p-5 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </button>

        <h2 className="text-lg font-display font-semibold text-foreground mb-4 pr-8 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          People you should meet 👋
        </h2>

        <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 sm:grid sm:grid-cols-5 scrollbar-hide">
          {scored.map(({ profile: p, sharedTags }) => (
            <div
              key={p.id}
              className="flex-shrink-0 w-[200px] sm:w-auto rounded-lg border border-border bg-card p-4 flex flex-col items-center text-center gap-2"
            >
              <button
                onClick={async () => {
                  await recordProfileView(p.id);
                  navigate(`/profile/${p.id}`, { state: { fromProfile: true } });
                }}
                className="flex flex-col items-center gap-2"
              >
                <Avatar className="h-14 w-14 border-2 border-card shadow-sm">
                  {p.avatar_url ? <AvatarImage src={p.avatar_url} loading="lazy" /> : null}
                  <AvatarFallback className="bg-secondary text-foreground text-sm">
                    {getInitials(p.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm text-foreground truncate max-w-[160px]">
                  {p.name?.split(" ")[0] ?? "Student"}
                </span>
              </button>

              {p.city && (
                <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                  📍 {p.city}
                </span>
              )}

              {sharedTags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {sharedTags.slice(0, 2).map((tag) => {
                    const info = getTagInfo(tag);
                    return (
                      <Badge key={tag} className={`${getTagBgColor(tag)} text-xs px-2 py-0.5`}>
                        {info?.icon} {info?.label}
                      </Badge>
                    );
                  })}
                </div>
              )}

              <Button
                size="sm"
                className="w-full mt-auto text-xs"
                onClick={() => handleSayHi(p)}
              >
                Say hi 👋
              </Button>
            </div>
          ))}
        </div>
      </div>

      {connectTarget && (
        <ConnectModal
          open={!!connectTarget}
          onOpenChange={(open) => !open && setConnectTarget(null)}
          studentId={connectTarget.id}
          studentName={connectTarget.name}
          initialNote={connectTarget.initialNote}
          sharedCity={currentProfile.city}
          sharedUniversity={currentProfile.university}
        />
      )}
    </>
  );
};

export default PeopleToMeet;
