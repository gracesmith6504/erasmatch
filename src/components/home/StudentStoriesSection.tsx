import { motion } from "framer-motion";
import { Star } from "lucide-react";

const stories = [
  {
    quote: "I matched with 3 people before arriving in Amsterdam. We travelled together every weekend and became inseparable.",
    name: "Julia Dubois",
    flag: "🇫🇷",
    university: "University of Amsterdam",
    initials: "JD",
    gradient: "from-erasmatch-blue/20 to-erasmatch-purple/20",
  },
  {
    quote: "I was nervous about going to Prague alone, but I already had a roommate through ErasMatch before arriving. Game changer!",
    name: "Marco Sanchez",
    flag: "🇪🇸",
    university: "Charles University Prague",
    initials: "MS",
    gradient: "from-erasmatch-green/20 to-erasmatch-blue/20",
  },
  {
    quote: "The city chat for Berlin was so active! I got amazing tips about housing and courses. It really helped me prepare.",
    name: "Lena Kowalski",
    flag: "🇵🇱",
    university: "Humboldt University Berlin",
    initials: "LK",
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
            Real experiences from the <span className="text-erasmatch-green">community.</span>
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
              {/* Stars */}
              <div className="flex gap-0.5 mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-erasmatch-yellow text-erasmatch-yellow" />
                ))}
              </div>
              
              <blockquote className="text-sm sm:text-base text-foreground leading-relaxed mb-5 sm:mb-6">
                "{story.quote}"
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
