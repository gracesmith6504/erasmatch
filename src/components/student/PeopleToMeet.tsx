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
import StudentCard from "@/components/student/StudentCard";
import { useNavigate } from "react-router-dom";
import { recordProfileView } from "@/hooks/useProfileViewers";

interface PeopleToMeetProps {
  profiles: Profile[];
  currentUserId: string;
  currentProfile: Profile;
  fullPage?: boolean;
  onShowAll?: () => void;
}

const STORAGE_KEY = "peopleToMeetDismissed";

const scoreProfile = (
  p: Profile,
  currentProfile: Profile
) => {
  const myUni = currentProfile.university;
  const mySemester = currentProfile.semester;
  const myTags = currentProfile.personality_tags ?? [];

  let score = 0;
  if (myUni && p.university === myUni) score += 8;
  if (mySemester && p.semester === mySemester) score += 6;
  const pTags = p.personality_tags ?? [];
  const shared = myTags.filter((t) => pTags.includes(t));
  score += shared.length * 3;
  if (p.avatar_url) score += 2;
  return { score, sharedTags: shared };
};

const PeopleToMeet: React.FC<PeopleToMeetProps> = ({
  profiles,
  currentUserId,
  currentProfile,
  fullPage = false,
  onShowAll,
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

  // Fetch university → country map
  const { data: uniCountryMap = {} } = useQuery({
    queryKey: ["university-country-map"],
    queryFn: async () => {
      const { data } = await supabase
        .from("universities")
        .select("name, country");
      if (!data) return {};
      const map: Record<string, string> = {};
      data.forEach((u) => {
        if (u.name && u.country) map[u.name] = u.country;
      });
      return map;
    },
    staleTime: 300_000,
  });

  const { scored, sectionTitle } = useMemo(() => {
    const myCity = currentProfile.city;
    const excludeSet = new Set([currentUserId, ...messagedIds]);
    const eligible = profiles.filter((p) => !excludeSet.has(p.id) && !p.deleted_at);
    const limit = fullPage ? 12 : 5;

    // Step 1: same city
    if (myCity) {
      const cityMatches = eligible
        .filter((p) => p.city === myCity)
        .map((p) => ({ profile: p, ...scoreProfile(p, currentProfile) }))
        .sort((a, b) => b.score - a.score);

      if (cityMatches.length >= 3) {
        return {
          scored: cityMatches.slice(0, limit),
          sectionTitle: `People going to ${myCity} 👋`,
        };
      }

      // Step 2: country fallback — fill remaining slots
      const myCountry = currentProfile.university
        ? uniCountryMap[currentProfile.university]
        : undefined;

      if (myCountry) {
        const cityMatchIds = new Set(cityMatches.map((m) => m.profile.id));
        const countryMatches = eligible
          .filter(
            (p) =>
              !cityMatchIds.has(p.id) &&
              p.university &&
              uniCountryMap[p.university] === myCountry
          )
          .map((p) => ({ profile: p, ...scoreProfile(p, currentProfile) }))
          .sort((a, b) => b.score - a.score);

        const combined = [...cityMatches, ...countryMatches].slice(0, limit);
        if (combined.length > 0) {
          const title =
            cityMatches.length > 0
              ? `People going to ${myCity} 👋`
              : `People going to ${myCountry} 👋`;
          return { scored: combined, sectionTitle: title };
        }
      }

      // City matches exist but < 3 and no country fallback
      if (cityMatches.length > 0) {
        return {
          scored: cityMatches.slice(0, limit),
          sectionTitle: `People going to ${myCity} 👋`,
        };
      }
    }

    // No city set — try country only
    const myCountry = currentProfile.university
      ? uniCountryMap[currentProfile.university]
      : undefined;

    if (myCountry) {
      const countryMatches = eligible
        .filter(
          (p) => p.university && uniCountryMap[p.university] === myCountry
        )
        .map((p) => ({ profile: p, ...scoreProfile(p, currentProfile) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      if (countryMatches.length > 0) {
        return {
          scored: countryMatches,
          sectionTitle: `People going to ${myCountry} 👋`,
        };
      }
    }

    // Step 3: nothing
    return { scored: [], sectionTitle: "" };
  }, [profiles, currentUserId, currentProfile, messagedIds, uniCountryMap, fullPage]);

  // If fullPage requested but fewer than 4 results, fall back to compact mode
  const effectiveFullPage = fullPage && scored.length >= 4;

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
      <div className={`mb-6 rounded-xl bg-primary/5 border border-primary/10 relative ${effectiveFullPage ? 'p-4 sm:p-6 md:p-8' : 'p-4 sm:p-5'}`}>
        {!effectiveFullPage && (
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </button>
        )}

        <div className={effectiveFullPage ? 'text-center mb-6' : 'mb-4 pr-8'}>
          <h2 className={`font-display font-semibold text-foreground flex items-center gap-2 ${effectiveFullPage ? 'text-xl sm:text-2xl justify-center' : 'text-lg'}`}>
            <Sparkles className={`text-primary ${effectiveFullPage ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-5 w-5'}`} />
            {sectionTitle}
          </h2>
          {effectiveFullPage && (
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Based on your city, university, and interests</p>
          )}
        </div>

        {effectiveFullPage ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {scored.map(({ profile: p }) => (
              <StudentCard
                key={p.id}
                profile={p}
                universityCity={p.city}
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 sm:grid sm:grid-cols-5 scrollbar-hide">
            {scored.map(({ profile: p, sharedTags }) => (
              <div
                key={p.id}
                className="rounded-lg border border-border bg-card flex flex-col items-center text-center gap-2 flex-shrink-0 w-[200px] sm:w-auto p-4"
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
                  <span className="font-medium text-foreground truncate max-w-[160px] text-sm">
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
        )}

        {effectiveFullPage && onShowAll && (
          <div className="text-center mt-6">
            <Button variant="outline" onClick={onShowAll} className="px-6">
              Browse everyone going →
            </Button>
          </div>
        )}
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
