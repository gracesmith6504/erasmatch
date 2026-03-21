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

const fallbackProfiles: FeaturedProfile[] = [
  { first_name: "Mia", avatar_url: "", country: "Germany" },
  { first_name: "Lucas", avatar_url: "", country: "France" },
  { first_name: "Sofia", avatar_url: "", country: "Italy" },
  { first_name: "Erik", avatar_url: "", country: "Sweden" },
  { first_name: "Clara", avatar_url: "", country: "Spain" },
  { first_name: "Petra", avatar_url: "", country: "Czech Republic" },
];

const toastActions = [
  "just joined the Barcelona group chat",
  "is looking for a flatmate in Lisbon",
  "just sent their first message",
  "just arrived in Amsterdam",
  "joined the Prague group chat",
  "is looking for a flatmate in Berlin",
];

const chatMessages = [
  { name: "Mia", message: "Anyone arriving Sept 1? Looking for people to explore with!", isRight: false },
  { name: "Lucas", message: "Yes! I land on Aug 31. Let's meet up 🙌", isRight: true },
  { name: "Sofia", message: "Already found a flat near campus, happy to help!", isRight: false },
  { name: "Erik", message: "Count me in! What area are you guys looking at?", isRight: false },
];

const memberAvatars = ["M", "L", "S", "E", "C"];

// Toast notification that floats in from the right
interface ToastData {
  id: number;
  profile: FeaturedProfile;
  action: string;
}

const FloatingToasts = ({ profiles }: { profiles: FeaturedProfile[] }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const idRef = useRef(0);
  const indexRef = useRef(0);

  useEffect(() => {
    if (profiles.length === 0) return;

    const addToast = () => {
      const pi = indexRef.current % profiles.length;
      const ai = indexRef.current % toastActions.length;
      indexRef.current++;

      const newToast: ToastData = {
        id: idRef.current++,
        profile: profiles[pi],
        action: toastActions[ai],
      };

      setToasts((prev) => [...prev.slice(-2), newToast]);

      // Remove after 5s (3s pause + fade)
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 5000);
    };

    // First toast immediately
    addToast();
    const interval = setInterval(addToast, 3000);
    return () => clearInterval(interval);
  }, [profiles]);

  return (
    <div className="absolute -right-4 top-12 flex flex-col gap-2 w-[220px] z-10">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border shadow-lg"
          >
            <Avatar className="h-6 w-6 shrink-0 border border-border">
              {toast.profile.avatar_url ? (
                <AvatarImage src={toast.profile.avatar_url} loading="lazy" />
              ) : null}
              <AvatarFallback className="text-[8px] bg-secondary text-foreground">
                {toast.profile.first_name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <p className="text-[9px] leading-tight text-foreground min-w-0">
              <span className="font-semibold">{toast.profile.first_name}</span>{" "}
              <span className="text-muted-foreground">{toast.action}</span>
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Looping chat messages that animate in one by one
const AnimatedChat = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (visibleCount < chatMessages.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      // Reset after showing all for 3s
      const timer = setTimeout(() => {
        setVisibleCount(0);
        setCycle((c) => c + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  return (
    <div className="p-3 flex flex-col gap-2 min-h-[160px]">
      <AnimatePresence mode="sync">
        {chatMessages.slice(0, visibleCount).map((msg, i) => (
          <motion.div
            key={`${cycle}-${i}`}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`flex ${msg.isRight ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[82%] px-3 py-2 rounded-2xl text-[10px] leading-relaxed ${
                msg.isRight
                  ? "bg-foreground text-primary-foreground rounded-br-sm"
                  : "bg-secondary text-foreground rounded-bl-sm"
              }`}
            >
              {!msg.isRight && (
                <p className="font-semibold mb-0.5 text-[9px] text-muted-foreground">{msg.name}</p>
              )}
              {msg.message}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const PhoneMockup = () => {
  const [profiles, setProfiles] = useState<FeaturedProfile[]>([]);

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

  return (
    <div className="relative flex justify-end">

      {/* Phone frame */}
      <div className="relative w-[280px]">
        {/* Dark phone bezel */}
        <div className="rounded-[2.5rem] bg-foreground p-3 shadow-xl">
          {/* Screen */}
          <div className="rounded-[2rem] bg-card overflow-hidden border border-border">
            {/* Status bar */}
            <div className="flex items-center justify-between px-5 py-1.5 bg-card">
              <span className="text-[8px] text-muted-foreground font-medium">9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-1.5 rounded-sm border border-muted-foreground/40" />
              </div>
            </div>

            {/* Chat header */}
            <div className="px-4 py-2.5 border-b border-border bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-foreground">University of Barcelona</p>
                  <p className="text-[9px] text-muted-foreground">24 members</p>
                </div>
                <div className="flex -space-x-1.5">
                  {memberAvatars.slice(0, 4).map((letter, i) => (
                    <div
                      key={i}
                      className="h-5 w-5 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-[7px] font-semibold text-foreground"
                    >
                      {letter}
                    </div>
                  ))}
                  <div className="h-5 w-5 rounded-full bg-accent/20 border-2 border-card flex items-center justify-center text-[7px] font-semibold text-accent">
                    +20
                  </div>
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <AnimatedChat />

            {/* Input bar */}
            <div className="px-3 pb-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-background">
                <span className="text-[9px] text-muted-foreground flex-1">Type a message...</span>
                <Send className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center pb-2">
              <div className="w-16 h-1 rounded-full bg-foreground/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
