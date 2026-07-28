import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { transformAvatarUrl } from "@/lib/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";
import { PERSONALITY_TAGS } from "@/components/profile/constants";
import { compareRecommendation, daysBetween } from "@/lib/studentOrdering";
import ConnectModal from "@/components/student/ConnectModal";

interface MatchRevealProps {
  currentProfile: Profile;
  onComplete: () => void;
  onBrowseAll: () => void;
}

type Tier = "city" | "country" | "none";

const PROFILE_SELECT =
  "id, name, avatar_url, university, city, semester, personality_tags, arrival_date, last_active_at";

const tagLabel = (value: string) => {
  const tag = PERSONALITY_TAGS.find((t) => t.value === value);
  return tag ? `${tag.icon} ${tag.label}` : value;
};

const joinReasons = (reasons: string[]): string => {
  if (reasons.length === 0) return "";
  if (reasons.length === 1) return reasons[0];
  if (reasons.length === 2) return `${reasons[0]} and ${reasons[1]}`;
  return `${reasons.slice(0, -1).join(", ")}, and ${reasons[reasons.length - 1]}`;
};

const buildReasons = (me: Profile, match: Profile, matchedOnCity: boolean): string[] => {
  const reasons: string[] = [];
  if (matchedOnCity && me.city) reasons.push(`also heading to ${me.city}`);
  else if (match.university && match.university === me.university) reasons.push(`both heading to ${me.university}`);

  const gapDays = daysBetween(me.arrival_date, match.arrival_date);
  if (gapDays !== null) {
    if (gapDays <= 2) reasons.push("arriving around the same day");
    else if (gapDays <= 14) reasons.push(`arriving within ${Math.ceil(gapDays)} days of you`);
  }

  const sharedTags = (me.personality_tags ?? []).filter((t) => (match.personality_tags ?? []).includes(t));
  if (sharedTags.length > 0) {
    reasons.push(`both into ${sharedTags.slice(0, 2).map(tagLabel).join(" & ")}`);
  }

  return reasons;
};

export const MatchReveal = ({ currentProfile, onComplete, onBrowseAll }: MatchRevealProps) => {
  const [tier, setTier] = useState<Tier | null>(null);
  const [match, setMatch] = useState<Profile | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [connectOpen, setConnectOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const pickBest = (rows: Profile[]) =>
      [...rows].sort((a, b) => compareRecommendation(a, b, currentProfile))[0];

    const resolve = async () => {
      if (currentProfile.city) {
        const { data } = await supabase
          .from("profiles")
          .select(PROFILE_SELECT)
          .is("deleted_at", null)
          .neq("id", currentProfile.id)
          .eq("city", currentProfile.city)
          .limit(50);

        if (!cancelled && data && data.length > 0) {
          const best = pickBest(data as Profile[]);
          setTier("city");
          setMatch(best);
          setReasons(buildReasons(currentProfile, best, true));
          return;
        }
      }

      if (currentProfile.university) {
        const { data: uniRow } = await supabase
          .from("universities")
          .select("country")
          .eq("name", currentProfile.university)
          .maybeSingle();

        const country = uniRow?.country;
        if (country) {
          const { data: sameCountryUnis } = await supabase
            .from("universities")
            .select("name")
            .eq("country", country);

          const names = (sameCountryUnis ?? []).map((u) => u.name).filter(Boolean) as string[];
          if (names.length > 0) {
            const { data } = await supabase
              .from("profiles")
              .select(PROFILE_SELECT)
              .is("deleted_at", null)
              .neq("id", currentProfile.id)
              .in("university", names)
              .limit(50);

            if (!cancelled && data && data.length > 0) {
              const best = pickBest(data as Profile[]);
              setTier("country");
              setMatch(best);
              setReasons(buildReasons(currentProfile, best, false));
              return;
            }
          }
        }
      }

      if (!cancelled) {
        setTier("none");
        setMatch(null);
        setReasons([]);
      }
    };

    resolve();
    return () => {
      cancelled = true;
    };
  }, [currentProfile]);

  useEffect(() => {
    if (!tier) return;
    window.posthog?.capture("match_reveal_shown", {
      tier,
      has_match: !!match,
      reason_count: reasons.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier]);

  if (!tier) return null;

  const firstName = match?.name?.split(" ")[0] || "them";
  const initials = firstName[0]?.toUpperCase() ?? "?";

  const handleBrowseAll = () => {
    window.posthog?.capture("match_reveal_dismissed", { tier });
    onBrowseAll();
  };

  const initialNote =
    reasons.length > 0
      ? `Hey! Saw we're ${joinReasons(reasons)} — how's your prep going?`
      : "Hey! Saw we're both doing Erasmus — how's your prep going?";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 px-6 text-center max-w-md"
      >
        {match ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Say hi to {firstName} 👋
            </h1>

            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              {match.avatar_url ? <AvatarImage src={transformAvatarUrl(match.avatar_url)} /> : null}
              <AvatarFallback className="bg-secondary text-foreground text-xl">{initials}</AvatarFallback>
            </Avatar>

            {reasons.length > 0 && (
              <p className="text-muted-foreground text-sm sm:text-base max-w-sm">
                You're {joinReasons(reasons)}.
              </p>
            )}

            <Button size="lg" onClick={() => setConnectOpen(true)} className="mt-2">
              <MessageCircle className="mr-1.5 h-4 w-4" /> Say hi to {firstName}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleBrowseAll} className="text-muted-foreground">
              Not feeling it? See everyone going to {currentProfile.city || "your destination"}
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              You're one of the first here 🚀
            </h1>
            <p className="text-muted-foreground">
              Nobody's signed up for {currentProfile.city || currentProfile.university || "your destination"} yet —
              you'll be the first person they meet.
            </p>
            <Button size="lg" onClick={onComplete} className="mt-2">
              Continue <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </>
        )}
      </motion.div>

      {match && (
        <ConnectModal
          open={connectOpen}
          onOpenChange={(open) => {
            setConnectOpen(open);
            if (!open) onComplete();
          }}
          studentId={match.id}
          studentName={match.name || "them"}
          studentAvatarUrl={match.avatar_url}
          studentCity={match.city}
          studentSemester={match.semester}
          studentLastActiveAt={match.last_active_at}
          sharedCity={tier === "city" ? currentProfile.city : null}
          sharedUniversity={tier === "country" && match.university === currentProfile.university ? currentProfile.university : null}
          initialNote={initialNote}
          onSent={() => window.posthog?.capture("match_reveal_message_sent", { tier })}
        />
      )}
    </div>
  );
};
