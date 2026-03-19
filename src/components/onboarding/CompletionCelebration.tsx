import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

type CompletionCelebrationProps = {
  onComplete: () => void;
};

export const CompletionCelebration = ({ onComplete }: CompletionCelebrationProps) => {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowCheckmark(true), 200);
    const t2 = setTimeout(() => setShowText(true), 600);
    const t3 = setTimeout(() => onComplete(), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{
              x: `${50 + (Math.random() - 0.5) * 20}%`,
              y: "110%",
              opacity: 0,
            }}
            animate={{
              y: `${10 + Math.random() * 60}%`,
              x: `${20 + Math.random() * 60}%`,
              opacity: [0, 1, 1, 0],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 1.8 + Math.random() * 0.8,
              delay: 0.1 + Math.random() * 0.5,
              ease: "easeOut",
            }}
          >
            {["🎉", "✨", "🌟", "🎊", "💫", "⭐"][i % 6]}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Checkmark circle */}
        <AnimatePresence>
          {showCheckmark && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Check className="h-12 w-12 text-white" strokeWidth={3} />
              </div>
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute inset-0 rounded-full bg-primary"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text */}
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-2 justify-center">
                You're all set
                <Sparkles className="h-6 w-6 text-erasmatch-green" />
              </h1>
              <p className="text-muted-foreground text-base">
                Let's find your people.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
