import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FeaturedProfile {
  first_name: string;
  avatar_url: string;
  country: string | null;
}

const actions = [
  "just joined the Barcelona group chat",
  "is looking for a flatmate in Lisbon",
  "just sent their first message",
  "just arrived in Amsterdam",
  "joined the Prague group chat",
  "is looking for a flatmate in Berlin",
];

const countryToFlag: Record<string, string> = {
  Spain: "🇪🇸",
  France: "🇫🇷",
  Germany: "🇩🇪",
  Italy: "🇮🇹",
  Netherlands: "🇳🇱",
  Portugal: "🇵🇹",
  Greece: "🇬🇷",
  "United Kingdom": "🇬🇧",
  Sweden: "🇸🇪",
  Poland: "🇵🇱",
  "Czech Republic": "🇨🇿",
  Czechia: "🇨🇿",
  Austria: "🇦🇹",
  Belgium: "🇧🇪",
  Denmark: "🇩🇰",
  Finland: "🇫🇮",
  Norway: "🇳🇴",
  Ireland: "🇮🇪",
  Hungary: "🇭🇺",
  Romania: "🇷🇴",
  Croatia: "🇭🇷",
  Turkey: "🇹🇷",
  Switzerland: "🇨🇭",
  ES: "🇪🇸",
  FR: "🇫🇷",
  DE: "🇩🇪",
  IT: "🇮🇹",
  NL: "🇳🇱",
  PT: "🇵🇹",
  GR: "🇬🇷",
  GB: "🇬🇧",
  SE: "🇸🇪",
  PL: "🇵🇱",
  CZ: "🇨🇿",
  AT: "🇦🇹",
  BE: "🇧🇪",
  DK: "🇩🇰",
  FI: "🇫🇮",
  NO: "🇳🇴",
  IE: "🇮🇪",
  HU: "🇭🇺",
  RO: "🇷🇴",
  HR: "🇭🇷",
  TR: "🇹🇷",
  CH: "🇨🇭",
  LT: "🇱🇹",
  LV: "🇱🇻",
  EE: "🇪🇪",
  SK: "🇸🇰",
  SI: "🇸🇮",
  BG: "🇧🇬",
  RS: "🇷🇸",
  Lithuania: "🇱🇹",
  Latvia: "🇱🇻",
  Estonia: "🇪🇪",
  Slovakia: "🇸🇰",
  Slovenia: "🇸🇮",
  Bulgaria: "🇧🇬",
  Serbia: "🇷🇸",
};

const fallbackProfiles: FeaturedProfile[] = [
  { first_name: "Mia", avatar_url: "", country: "Germany" },
  { first_name: "Lucas", avatar_url: "", country: "France" },
  { first_name: "Sofia", avatar_url: "", country: "Italy" },
  { first_name: "Erik", avatar_url: "", country: "Sweden" },
  { first_name: "Clara", avatar_url: "", country: "Spain" },
  { first_name: "Petra", avatar_url: "", country: "Czech Republic" },
];

interface ActivityCard {
  id: number;
  profile: FeaturedProfile;
  action: string;
}

export const PhoneMockup = () => {
  const [profiles, setProfiles] = useState<FeaturedProfile[]>([]);
  const [cards, setCards] = useState<ActivityCard[]>([]);
  const indexRef = useRef(0);
  const cardIdRef = useRef(0);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase.rpc("get_featured_activity_profiles");
      if (error || !data || data.length === 0) {
        setProfiles(fallbackProfiles);
      } else {
        setProfiles(data as FeaturedProfile[]);
      }
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (profiles.length === 0) return;

    // Seed initial cards
    const initial: ActivityCard[] = [];
    for (let i = 0; i < 4; i++) {
      initial.push({
        id: cardIdRef.current++,
        profile: profiles[i % profiles.length],
        action: actions[i % actions.length],
      });
    }
    indexRef.current = 4;
    setCards(initial);

    const interval = setInterval(() => {
      const pi = indexRef.current % profiles.length;
      const ai = indexRef.current % actions.length;
      indexRef.current++;

      setCards((prev) => {
        const next = [
          ...prev.slice(-4),
          {
            id: cardIdRef.current++,
            profile: profiles[pi],
            action: actions[ai],
          },
        ];
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [profiles]);

  return (
    <div className="flex justify-center">
      <div className="relative w-[320px] rounded-2xl bg-card border border-border shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-xs font-semibold text-foreground">Activity</p>
          <span className="h-2 w-2 rounded-full bg-erasmatch-green animate-pulse" />
        </div>

        {/* Feed */}
        <div className="h-[360px] overflow-hidden relative">
          <div className="absolute inset-0 flex flex-col justify-end gap-2 p-3">
            <AnimatePresence initial={false}>
              {cards.slice(-5).map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-background border border-border shadow-sm"
                >
                  <Avatar className="h-8 w-8 shrink-0 border border-border">
                    {card.profile.avatar_url ? (
                      <AvatarImage src={card.profile.avatar_url} loading="lazy" />
                    ) : null}
                    <AvatarFallback className="text-[10px] bg-secondary text-foreground">
                      {card.profile.first_name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] leading-tight text-foreground">
                      <span className="font-semibold">{card.profile.first_name}</span>
                      {card.profile.country && countryToFlag[card.profile.country] && (
                        <span className="ml-1">{countryToFlag[card.profile.country]}</span>
                      )}
                      {" "}
                      <span className="text-muted-foreground">{card.action}</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
