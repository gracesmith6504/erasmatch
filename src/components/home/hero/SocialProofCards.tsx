import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const recentStudents = [
  { name: "Emma", flag: "🇮🇪", route: "Dublin to Barcelona", initials: "EM" },
  { name: "Matteo", flag: "🇮🇹", route: "Milan to Amsterdam", initials: "MA" },
  { name: "Annika", flag: "🇩🇪", route: "Munich to Lisbon", initials: "AN" },
  { name: "Jules", flag: "🇫🇷", route: "Lyon to Prague", initials: "JU" },
  { name: "Petra", flag: "🇭🇷", route: "Zagreb to Madrid", initials: "PE" },
];

const avatarColors = [
  "bg-erasmatch-blue/20",
  "bg-erasmatch-coral/20",
  "bg-erasmatch-green/20",
  "bg-erasmatch-purple/20",
  "bg-erasmatch-orange/20",
];

export const SocialProofCards = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(72), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto space-y-4">
      {/* Recently joined card */}
      <motion.div
        className="bg-card rounded-2xl p-5 shadow-card border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-foreground">Recently joined</p>
          <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">Live</span>
        </div>
        <div className="space-y-3">
          {recentStudents.map((student, i) => (
            <motion.div
              key={student.name}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
            >
              <div className={`h-8 w-8 rounded-full ${avatarColors[i]} flex items-center justify-center flex-shrink-0`}>
                <span className="text-[10px] font-bold text-foreground/70">{student.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {student.flag} {student.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">{student.route}</p>
              </div>
              <span className="text-[10px] text-muted-foreground/60 flex-shrink-0">just now</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Today's counter card */}
      <motion.div
        className="bg-card rounded-2xl p-5 shadow-card border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">23 students joined today</p>
          <span className="text-erasmatch-green text-xs font-medium">+12%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-foreground"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Daily goal: 32 students</p>
      </motion.div>
    </div>
  );
};
