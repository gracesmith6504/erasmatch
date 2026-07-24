import { motion } from "framer-motion";

const reasons = [
  {
    number: "01",
    title: "Find your future flatmate",
    description:
      "See who's heading to your city the same semester. Most students find their flatmate or travel buddy within a day of signing up.",
  },
  {
    number: "02",
    title: "Get real answers, not Google results",
    description:
      "Ask alumni who actually lived there about housing, transport, and neighbourhoods — the stuff you can't find in a guide.",
  },
  {
    number: "03",
    title: "Know people before you land",
    description:
      "Swap Instagrams, plan your first week, and arrive with friends instead of strangers. Your Erasmus starts before the plane takes off.",
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
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-foreground text-balance">
            The things you actually
            <br className="hidden sm:block" />
            <span className="text-erasmatch-green"> stress about before Erasmus.</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {reasons.map((reason) => (
            <motion.div
              key={reason.title}
              variants={item}
              className="group relative p-5 sm:p-7 border-t border-border pt-6 sm:pt-8 cursor-default"
            >
              <span className="block text-xs sm:text-sm font-semibold tracking-widest text-erasmatch-green mb-4 sm:mb-6 tabular-nums">
                {reason.number}
              </span>
              <h3 className="font-semibold text-foreground mb-2 sm:mb-3 text-base sm:text-lg leading-snug">
                {reason.title}
              </h3>
              <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
