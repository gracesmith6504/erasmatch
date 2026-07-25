import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

const chatMessages = [
  { name: "Mia", message: "Anyone have tips for finding a room near campus? 🏠", isRight: false },
  { name: "Lucas", message: "Try the Facebook housing group, that's how I found mine!", isRight: true },
  { name: "Sofia", message: "Who else is arriving the first week of Sept? Let's explore together 🗺️", isRight: false },
  { name: "Erik", message: "Count me in! What area are you guys staying in?", isRight: false },
];

const memberAvatars = ["M", "L", "S", "E", "C"];

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
      const timer = setTimeout(() => {
        setVisibleCount(0);
        setCycle((c) => c + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  return (
    <div className="p-3 flex flex-col gap-2 h-[220px] overflow-hidden">
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
