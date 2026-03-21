import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const notifications = [
  { name: "Mia", city: "Barcelona", flag: "🇩🇪" },
  { name: "Lucas", city: "Lisbon", flag: "🇫🇷" },
  { name: "Sofia", city: "Berlin", flag: "🇮🇹" },
  { name: "Erik", city: "Amsterdam", flag: "🇸🇪" },
  { name: "Clara", city: "Prague", flag: "🇪🇸" },
];

export const RotatingNotification = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % notifications.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = notifications[index];

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card mb-6 sm:mb-8 overflow-hidden h-8">
      <span className="h-2 w-2 rounded-full bg-erasmatch-green animate-pulse flex-shrink-0" />
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap"
        >
          {current.flag} {current.name} just joined {current.city}
        </motion.span>
      </AnimatePresence>
      <span className="text-[10px] text-muted-foreground/60 flex-shrink-0">2m ago</span>
    </div>
  );
};
