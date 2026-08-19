import { motion } from "framer-motion";
import { Users, MessageCircle, Home } from "lucide-react";

const highlights = [
  {
    icon: Users,
    title: "Have someone to go to welcome week with",
    description:
      "Your first week doesn't have to be navigating campus alone. Find students heading to the same city and plan your welcome week together.",
  },
  {
    icon: MessageCircle,
    title: "Ask people who've actually been there",
    description:
      "Get real advice about housing, transport, and student life from alumni and current students at your destination.",
  },
  {
    icon: Home,
    title: "Find a flatmate before you arrive",
    description:
      "Looking for a roommate? See who else needs a flat in your city the same semester and sort housing before you land.",
  },
];

export const StudentStoriesSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-erasmatch-green mb-3">Your Erasmus starter pack</p>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-foreground">
            Everything you need <span className="text-erasmatch-green">before you go.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-background rounded-2xl p-5 sm:p-6 border border-border hover:shadow-card transition-all duration-300"
            >
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-erasmatch-green/10 flex items-center justify-center mb-4">
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-erasmatch-green" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
