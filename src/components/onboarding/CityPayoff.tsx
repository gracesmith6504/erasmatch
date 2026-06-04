import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, UserPlus } from "lucide-react";
import InviteFriendModal from "@/components/share/InviteFriendModal";

interface CityPayoffProps {
  city: string | null;
  university: string | null;
  userId: string;
  refCode?: string | null;
  onComplete: () => void;
}

interface CityProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
}

type Tier = "destination" | "country" | "first";
type MatchType = "uni+city" | "uni" | "city" | null;

interface TierResult {
  tier: Tier;
  count: number;
  profiles: CityProfile[];
  university: string | null;
  city: string | null;
  country: string | null;
  matchType: MatchType;
}

export const CityPayoff = ({ city, university, userId, refCode, onComplete }: CityPayoffProps) => {
  const [result, setResult] = useState<TierResult | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const resolve = async () => {
      // Tier 1: destination (university OR city) — combined
      const orFilters: string[] = [];
      if (university) orFilters.push(`university.eq."${university}"`);
      if (city) orFilters.push(`city.eq."${city}"`);

      if (orFilters.length > 0) {
        const { data, count } = await supabase
          .from("profiles")
          .select("id, name, avatar_url, university, city", { count: "exact" })
          .is("deleted_at", null)
          .neq("id", userId)
          .or(orFilters.join(","))
          .order("avatar_url", { ascending: false, nullsFirst: false })
          .limit(50);

        if ((count ?? 0) > 0 && data && data.length > 0) {
          const uniMatches = data.filter((p) => university && p.university === university);
          const cityMatches = data.filter(
            (p) => city && p.city === city && !(university && p.university === university)
          );
          const ordered = [...uniMatches, ...cityMatches].slice(0, 3);

          const hasUni = uniMatches.length > 0;
          const hasCity = data.some((p) => city && p.city === city);
          const matchType: MatchType =
            hasUni && hasCity ? "uni+city" : hasUni ? "uni" : "city";

          setResult({
            tier: "destination",
            count: count ?? 0,
            profiles: ordered,
            university,
            city,
            country: null,
            matchType,
          });
          return;
        }
      }

      // Tier 2: same country (resolve via universities table)
      if (university) {
        const { data: uniRow } = await supabase
          .from("universities")
          .select("country")
          .eq("name", university)
          .maybeSingle();

        const country = uniRow?.country;
        if (country) {
          const { data: sameCountryUnis } = await supabase
            .from("universities")
            .select("name")
            .eq("country", country);

          const names = (sameCountryUnis ?? []).map((u) => u.name).filter(Boolean) as string[];
          if (names.length > 0) {
            const { data, count } = await supabase
              .from("profiles")
              .select("id, name, avatar_url, university, city", { count: "exact" })
              .is("deleted_at", null)
              .neq("id", userId)
              .in("university", names)
              .order("avatar_url", { ascending: false, nullsFirst: false })
              .limit(3);

            if ((count ?? 0) > 0) {
              setResult({
                tier: "country",
                count: count ?? 0,
                profiles: data ?? [],
                university,
                city,
                country,
                matchType: null,
              });
              return;
            }
          }
        }
      }

      // Tier 3: first mover
      setResult({
        tier: "first",
        count: 0,
        profiles: [],
        university,
        city,
        country: null,
        matchType: null,
      });
    };

    resolve();
  }, [city, university, userId]);

  useEffect(() => {
    if (!result) return;
    window.posthog?.capture("city_payoff_shown", {
      tier: result.tier,
      peer_count: result.count,
      match_type: result.matchType,
    });
    if (result.tier !== "first") {
      timerRef.current = setTimeout(onComplete, 6000);
    }
    return () => clearTimeout(timerRef.current);
  }, [result, onComplete]);

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (!result) return null;

  const headline = (() => {
    const n = result.count;
    const s = n !== 1 ? "s" : "";
    switch (result.tier) {
      case "destination": {
        if (result.matchType === "uni+city" && result.university && result.city) {
          return `${n} student${s} heading to ${result.university} & ${result.city} 🎓`;
        }
        if (result.matchType === "uni" && result.university) {
          return `${n} student${s} also at ${result.university} 🎓`;
        }
        return `${n} student${s} already going to ${result.city} 🎉`;
      }
      case "country":
        return `${n} student${s} heading to ${result.country} this year 🌍`;
      case "first":
        return `You're a trailblazer 🚀`;
    }
  })();


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 px-6 text-center max-w-md"
      >
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          {headline}
        </h1>

        {result.tier !== "first" ? (
          <>
            {result.profiles.length > 0 && (
              <div className="flex -space-x-3">
                {result.profiles.map((p) => (
                  <Avatar key={p.id} className="h-16 w-16 border-4 border-background shadow-md">
                    {p.avatar_url ? <AvatarImage src={p.avatar_url} /> : null}
                    <AvatarFallback className="bg-secondary text-foreground text-sm">
                      {getInitials(p.name)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            )}
            <Button size="lg" onClick={onComplete} className="mt-2">
              Meet them <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground">
              You're one of the first heading to {result.city || result.university || "your destination"}. Bring your crew and start your Erasmus chat early.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
              {refCode && (
                <Button size="lg" onClick={() => setInviteOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite a friend
                </Button>
              )}
              <Button size="lg" variant="outline" onClick={onComplete}>
                Explore students <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </motion.div>

      {refCode && (
        <InviteFriendModal
          open={inviteOpen}
          onOpenChange={setInviteOpen}
          refCode={refCode}
        />
      )}
    </div>
  );
};
