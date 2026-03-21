import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";

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
  Spain: "\u{1F1EA}\u{1F1F8}",
  France: "\u{1F1EB}\u{1F1F7}",
  Germany: "\u{1F1E9}\u{1F1EA}",
  Italy: "\u{1F1EE}\u{1F1F9}",
  Netherlands: "\u{1F1F3}\u{1F1F1}",
  Portugal: "\u{1F1F5}\u{1F1F9}",
  Greece: "\u{1F1EC}\u{1F1F7}",
  "United Kingdom": "\u{1F1EC}\u{1F1E7}",
  Sweden: "\u{1F1F8}\u{1F1EA}",
  Poland: "\u{1F1F5}\u{1F1F1}",
  "Czech Republic": "\u{1F1E8}\u{1F1FF}",
  Czechia: "\u{1F1E8}\u{1F1FF}",
  Austria: "\u{1F1E6}\u{1F1F9}",
  Belgium: "\u{1F1E7}\u{1F1EA}",
  Denmark: "\u{1F1E9}\u{1F1F0}",
  Finland: "\u{1F1EB}\u{1F1EE}",
  Norway: "\u{1F1F3}\u{1F1F4}",
  Ireland: "\u{1F1EE}\u{1F1EA}",
  Hungary: "\u{1F1ED}\u{1F1FA}",
  Romania: "\u{1F1F7}\u{1F1F4}",
  Croatia: "\u{1F1ED}\u{1F1F7}",
  Turkey: "\u{1F1F9}\u{1F1F7}",
  Switzerland: "\u{1F1E8}\u{1F1ED}",
  ES: "\u{1F1EA}\u{1F1F8}",
  FR: "\u{1F1EB}\u{1F1F7}",
  DE: "\u{1F1E9}\u{1F1EA}",
  IT: "\u{1F1EE}\u{1F1F9}",
  NL: "\u{1F1F3}\u{1F1F1}",
  PT: "\u{1F1F5}\u{1F1F9}",
  GR: "\u{1F1EC}\u{1F1F7}",
  GB: "\u{1F1EC}\u{1F1E7}",
  SE: "\u{1F1F8}\u{1F1EA}",
  PL: "\u{1F1F5}\u{1F1F1}",
  CZ: "\u{1F1E8}\u{1F1FF}",
  AT: "\u{1F1E6}\u{1F1F9}",
  BE: "\u{1F1E7}\u{1F1EA}",
  DK: "\u{1F1E9}\u{1F1F0}",
  FI: "\u{1F1EB}\u{1F1EE}",
  NO: "\u{1F1F3}\u{1F1F4}",
  IE: "\u{1F1EE}\u{1F1EA}",
  HU: "\u{1F1ED}\u{1F1FA}",
  RO: "\u{1F1F7}\u{1F1F4}",
  HR: "\u{1F1ED}\u{1F1F7}",
  TR: "\u{1F1F9}\u{1F1F7}",
  CH: "\u{1F1E8}\u{1F1ED}",
  LT: "\u{1F1F1}\u{1F1F9}",
  LV: "\u{1F1F1}\u{1F1FB}",
  EE: "\u{1F1EA}\u{1F1EA}",
  SK: "\u{1F1F8}\u{1F1F0}",
  SI: "\u{1F1F8}\u{1F1EE}",
  BG: "\u{1F1E7}\u{1F1EC}",
  RS: "\u{1F1F7}\u{1F1F8}",
  Lithuania: "\u{1F1F1}\u{1F1F9}",
  Latvia: "\u{1F1F1}\u{1F1FB}",
  Estonia: "\u{1F1EA}\u{1F1EA}",
  Slovakia: "\u{1F1F8}\u{1F1F0}",
  Slovenia: "\u{1F1F8}\u{1F1EE}",
  Bulgaria: "\u{1F1E7}\u{1F1EC}",
  Serbia: "\u{1F1F7}\u{1F1F8}",
};

const fallbackProfiles: FeaturedProfile[] = [
  { first_name: "Mia", avatar_url: "", country: "Germany" },
  { first_name: "Lucas", avatar_url: "", country: "France" },
  { first_name: "Sofia", avatar_url: "", country: "Italy" },
  { first_name: "Erik", avatar_url: "", country: "Sweden" },
  { first_name: "Clara", avatar_url: "", country: "Spain" },
  { first_name: "Petra", avatar_url: "", country: "Czech Republic" },
];

const mockChatMessages = [
  { name: "Mia", message: "Anyone arriving Sept 1? Looking for people to explore with!", isRight: false },
  { name: "Lucas", message: "Yes! I land on Aug 31. Let's meet up", isRight: true },
  { name: "Sofia", message: "Class, already found a flat near campus", isRight: false },
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

    const initial: ActivityCard[] = [];
    for (let i = 0; i < 3; i++) {
      initial.push({
        id: cardIdRef.current++,
        profile: profiles[i % profiles.length],
        action: actions[i % actions.length],
      });
    }
    indexRef.current = 3;
    setCards(initial);

    const interval = setInterval(() => {
      const pi = indexRef.current % profiles.length;
      const ai = indexRef.current % actions.length;
      indexRef.current++;

      setCards((prev) => {
        const next = [
          ...prev.slice(-3),
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
    <div className="relative flex justify-center">
      {/* Decorative background circles */}
      <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-secondary blur-2xl" />

      <div className="relative w-[340px] flex flex-col gap-3">
        {/* Activity feed card */}
        <div className="rounded-2xl bg-card border border-border shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-foreground">Activity</p>
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          </div>

          <div className="h-[180px] overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col justify-end gap-1.5 p-3">
              <AnimatePresence initial={false}>
                {cards.slice(-3).map((card) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border"
                  >
                    <Avatar className="h-7 w-7 shrink-0 border border-border">
                      {card.profile.avatar_url ? <AvatarImage src={card.profile.avatar_url} loading="lazy" /> : null}
                      <AvatarFallback className="text-[9px] bg-secondary text-foreground">
                        {card.profile.first_name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-[10px] leading-tight text-foreground min-w-0">
                      <span className="font-semibold">{card.profile.first_name}</span>
                      {card.profile.country && countryToFlag[card.profile.country] && (
                        <span className="ml-0.5">{countryToFlag[card.profile.country]}</span>
                      )}{" "}
                      <span className="text-muted-foreground">{card.action}</span>
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mock group chat card */}
        <div className="rounded-2xl bg-card border border-border shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-foreground">University of Barcelona</p>
              <span className="text-[10px] text-muted-foreground">12 members</span>
            </div>
            <div className="flex -space-x-1.5">
              {fallbackProfiles.slice(0, 3).map((p, i) => (
                <div
                  key={i}
                  className="h-5 w-5 rounded-full bg-secondary border border-card flex items-center justify-center text-[8px] font-medium text-foreground"
                >
                  {p.first_name.charAt(0)}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 flex flex-col gap-2">
            {mockChatMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.3, duration: 0.4 }}
                className={`flex ${msg.isRight ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-[10px] leading-relaxed ${
                    msg.isRight
                      ? "bg-foreground text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm"
                  }`}
                >
                  {!msg.isRight && <p className="font-semibold mb-0.5 text-[9px] text-muted-foreground">{msg.name}</p>}
                  {msg.message}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Fake input */}
          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-background">
              <span className="text-[10px] text-muted-foreground flex-1">Type a message...</span>
              <Send className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
