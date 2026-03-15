import { Users, MessageCircle, GraduationCap, Calendar, Heart } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  {
    icon: GraduationCap,
    title: "Built only for Erasmus",
    description:
      "This isn't a general social app. Every feature exists because Erasmus students actually need it. Your semester, your university, your city.",
    color: "bg-erasmatch-green/10 text-erasmatch-green",
  },
  {
    icon: Users,
    title: "Find your exact people",
    description:
      "Search by destination university and semester to find students landing in the same place at the same time as you. Not random matches, real ones.",
    color: "bg-erasmatch-blue/10 text-erasmatch-blue",
  },
  {
    icon: MessageCircle,
    title: "Group chats that create themselves",
    description:
      "When you pick your city and university, you're automatically added to the right group chats. No searching, no invite links, just conversation.",
    color: "bg-erasmatch-coral/10 text-erasmatch-coral",
  },
  {
    icon: Heart,
    title: "Advice from students who've been there",
    description:
      "Ask real questions to people who already did their Erasmus at your destination. Accommodation tips, nightlife, course reviews, the honest stuff.",
    color: "bg-erasmatch-purple/10 text-erasmatch-purple",
  },
  {
    icon: Calendar,
    title: "Organised around your timeline",
    description:
      "Arrival dates, semester filters, and \"looking for\" tags so you can find roommates before you arrive, travel buddies during, and friends for life after.",
    color: "bg-erasmatch-orange/10 text-erasmatch-orange",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export const FeaturesSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-erasmatch-green mb-3">
            Why ErasMatch
          </p>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-foreground text-balance mb-3 sm:mb-4">
            Not just where you're going.
            <br className="hidden sm:block" />
            <span className="text-erasmatch-green"> Who you're going with.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            We're not trying to be everything for everyone. ErasMatch does one thing: help Erasmus students find each other before they arrive.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              variants={item}
              className={`group relative p-5 sm:p-7 rounded-2xl bg-background border border-border hover:border-border/80 hover:shadow-card hover:scale-[1.02] transition-all duration-300 cursor-default ${
                index === 3 ? "lg:col-start-1" : ""
              }`}
            >
              <div
                className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl ${reason.color} flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <reason.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5 sm:mb-2 text-base sm:text-[1.05rem]">
                {reason.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
