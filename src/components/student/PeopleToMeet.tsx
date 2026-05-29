import React, { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { X, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ConnectModal from "@/components/student/ConnectModal";
import StudentCard from "@/components/student/StudentCard";
import { useNavigate, Link } from "react-router-dom";
import { recordProfileView } from "@/hooks/useProfileViewers";
import { compareRecommendation, scoreRecommendation } from "@/lib/studentOrdering";
import { transformAvatarUrl } from "@/lib/avatar";

interface PeopleToMeetProps {
  profiles: Profile[];
  currentUserId: string;
  currentProfile: Profile;
  fullPage?: boolean;
  onShowAll?: () => void;
}

const STORAGE_KEY = "peopleToMeetDismissed";

const RecommendationAvatar = ({ profile, index }: { profile: Profile; index: number }) => {
  const fallbackSrc = profile.avatar_url || undefined;
  const [avatarSrc, setAvatarSrc] = useState(() => transformAvatarUrl(profile.avatar_url, 72));

  useEffect(() => {
    setAvatarSrc(transformAvatarUrl(profile.avatar_url, 72));
  }, [profile.avatar_url]);

  const initials = profile.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <Avatar className="h-16 w-16 bg-secondary ring-1 ring-transparent group-hover:ring-border transition-all">
      {avatarSrc ? (
        <img
          key={avatarSrc}
          src={avatarSrc}
          alt={profile.name || "Student profile photo"}
          className="aspect-square h-full w-full object-cover"
          loading={index < 4 ? "eager" : "lazy"}
          fetchPriority={index < 4 ? "high" : "auto"}
          decoding="async"
          onError={() => {
            if (fallbackSrc && avatarSrc !== fallbackSrc) {
              setAvatarSrc(fallbackSrc);
            } else {
              setAvatarSrc(undefined);
            }
          }}
        />
      ) : (
        <AvatarFallback className="bg-secondary text-foreground text-sm">
          {initials}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

const PeopleToMeet: React.FC<PeopleToMeetProps> = ({
  profiles,
  currentUserId,
  currentProfile,
  fullPage = false,
  onShowAll,
}) => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(STORAGE_KEY) === "true");
  const [connectTarget, setConnectTarget] = useState<{
    id: string;
    name: string;
    initialNote: string;
  } | null>(null);

  const { data: messagedIds = [], isLoading: messagesLoading } = useQuery({
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

  const { data: uniCountryMap = {}, isLoading: countriesLoading } = useQuery({
    queryKey: ["university-country-map"],
    queryFn: async () => {
      const { data } = await supabase.from("universities").select("name, country");
      if (!data) return {};
      const map: Record<string, string> = {};
      data.forEach((u) => {
        if (u.name && u.country) map[u.name] = u.country;
      });
      return map;
    },
    staleTime: 300_000,
  });

  const { scored, destinationName, destinationKind } = useMemo(() => {
    const myCity = currentProfile.city;
    const excludeSet = new Set([currentUserId, ...messagedIds]);
    const eligible = profiles.filter((p) => !excludeSet.has(p.id) && !p.deleted_at);
    const limit = fullPage ? 12 : 10;
    const now = Date.now();
    const rank = (list: Profile[]) =>
      [...list]
        .sort((a, b) => compareRecommendation(a, b, currentProfile, now))
        .map((p) => ({ profile: p, score: scoreRecommendation(p, currentProfile) }));

    if (myCity) {
      const cityMatches = rank(eligible.filter((p) => p.city === myCity));

      if (cityMatches.length >= 3) {
        return { scored: cityMatches.slice(0, limit), destinationName: myCity, destinationKind: "city" as const };
      }

      const myCountry = currentProfile.university ? uniCountryMap[currentProfile.university] : undefined;
      if (myCountry) {
        const cityMatchIds = new Set(cityMatches.map((m) => m.profile.id));
        const countryMatches = rank(
          eligible.filter((p) => !cityMatchIds.has(p.id) && p.university && uniCountryMap[p.university] === myCountry)
        );

        const combinedProfiles = [...cityMatches, ...countryMatches].map((match) => match.profile);
        const combined = rank(combinedProfiles).slice(0, limit);
        if (combined.length > 0) {
          const isCity = cityMatches.length > 0;
          return {
            scored: combined,
            destinationName: isCity ? myCity : myCountry,
            destinationKind: (isCity ? "city" : "country") as "city" | "country",
          };
        }
      }

      if (cityMatches.length > 0) {
        return { scored: cityMatches.slice(0, limit), destinationName: myCity, destinationKind: "city" as const };
      }
    }

    const myCountry = currentProfile.university ? uniCountryMap[currentProfile.university] : undefined;
    if (myCountry) {
      const countryMatches = rank(
        eligible.filter((p) => p.university && uniCountryMap[p.university] === myCountry)
      ).slice(0, limit);

      if (countryMatches.length > 0) {
        return { scored: countryMatches, destinationName: myCountry, destinationKind: "country" as const };
      }
    }

    return { scored: [], destinationName: "", destinationKind: "city" as const };
  }, [profiles, currentUserId, currentProfile, messagedIds, uniCountryMap, fullPage]);

  const effectiveFullPage = fullPage && scored.length >= 4;

  if (dismissed || messagesLoading || countriesLoading || scored.length === 0) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  // Build smart View all link based on what the section is actually showing.
  // Filter only by destination city — never pre-apply the user's own university,
  // since "View all" should show everyone going there, not narrow further.
  const viewAllHref = (() => {
    const params = new URLSearchParams();
    if (destinationKind === "city") {
      params.set("city", destinationName);
    }
    const qs = params.toString();
    return qs ? `/students?${qs}` : "/students";
  })();

  const viewAllLabel = `See everyone going to ${destinationName}`;

  return (
    <>
      <section className={`mb-8 relative ${effectiveFullPage ? "" : "pt-1"}`}>
        {!effectiveFullPage && (
          <button
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="absolute top-0 right-0 text-muted-foreground/60 hover:text-foreground transition-colors p-1 -mr-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className={effectiveFullPage ? "text-center mb-6" : "mb-4 pr-8"}>
          <div className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-1">
            For you
          </div>
          <h2
            className={`font-display font-semibold text-foreground ${
              effectiveFullPage ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
            }`}
          >
            People going to {destinationName}
          </h2>
          {effectiveFullPage && (
            <p className="text-muted-foreground mt-1.5 text-sm">
              Based on your city, university, and interests
            </p>
          )}
        </div>

        {effectiveFullPage ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {scored.map(({ profile: p }, i) => (
              <StudentCard key={p.id} profile={p} universityCity={p.city} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="flex gap-5 sm:gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-1 px-1">
            {scored.map(({ profile: p }, i) => (
              <button
                key={p.id}
                onClick={async () => {
                  await recordProfileView(p.id);
                  navigate(`/profile/${p.id}`, { state: { fromProfile: true } });
                }}
                className="flex flex-col items-center text-center gap-1.5 flex-shrink-0 w-[88px] snap-start group"
              >
                <RecommendationAvatar profile={p} index={i} />
                <span className="font-medium text-foreground text-xs truncate max-w-full leading-tight">
                  {p.name?.split(" ")[0] ?? "Student"}
                </span>
                {p.city && (
                  <span className="text-[11px] text-muted-foreground truncate max-w-full leading-tight">
                    {p.city}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {effectiveFullPage && onShowAll && (
          <div className="text-center mt-6">
            <Button variant="outline" onClick={onShowAll} className="px-6">
              {viewAllLabel}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        )}

        {!effectiveFullPage && (
          <div className="mt-4 flex justify-end">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-sm font-medium text-foreground hover:bg-secondary"
            >
              <Link to={viewAllHref}>
                {viewAllLabel}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </section>

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
