import { motion } from "framer-motion";

const stories = [
  {
    quote: "I found a flatmate for my apartment in Lisbon before I even booked my flight. We ended up living together the whole semester.",
    name: "Emma K.",
    flag: "🇩🇪",
    university: "University of Lisbon",
    initials: "EK",
    gradient: "from-erasmatch-blue/20 to-erasmatch-purple/20",
  },
  {
    quote: "I messaged an alumni who'd been at my exact university. She told me which neighbourhood to avoid and which landlords were legit. Saved me so much stress.",
    name: "Tomas R.",
    flag: "🇨🇿",
    university: "UPF Barcelona",
    initials: "TR",
    gradient: "from-erasmatch-green/20 to-erasmatch-blue/20",
  },
  {
    quote: "I was panicking about going to Budapest alone. Turns out 8 other people from my country were going too. We met up the first day.",
    name: "Sarah L.",
    flag: "🇮🇪",
    university: "Corvinus University Budapest",
    initials: "SL",
    gradient: "from-erasmatch-coral/20 to-erasmatch-orange/20",
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
          <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-erasmatch-green mb-3">Student stories</p>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-foreground">
            What students say after <span className="text-erasmatch-green">their exchange.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {stories.map((story, index) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-background rounded-2xl p-5 sm:p-6 border border-border hover:shadow-card transition-all duration-300"
            >
              <blockquote className="text-base sm:text-lg text-foreground leading-relaxed mb-5 sm:mb-6 font-display">
                &ldquo;{story.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br ${story.gradient} flex items-center justify-center text-xs sm:text-sm font-semibold text-foreground`}>
                  {story.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{story.name} {story.flag}</p>
                  <p className="text-xs text-muted-foreground">{story.university}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
