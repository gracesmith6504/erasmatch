import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface CommunitySectionProps {
  handleFindStudents: () => void;
}

const universities = [
  "University of Barcelona",
  "Humboldt University",
  "Sorbonne University",
  "University of Amsterdam",
  "University of Lisbon",
  "Politecnico di Milano",
  "Charles University",
  "KU Leuven",
];

export const CommunitySection = ({ handleFindStudents }: CommunitySectionProps) => {
  return (
    <section className="py-16 sm:py-24 bg-foreground text-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-5xl mb-4 sm:mb-6 font-display font-bold">
            Free, private, and{" "}
            <span className="gradient-text">growing fast.</span>
          </h2>
          <p className="text-base sm:text-lg text-background/70 leading-relaxed">
            A safe space to meet, plan, and connect with real students before and during Erasmus.
          </p>
        </motion.div>

        {/* University marquee */}
        <div className="relative mb-10 sm:mb-14">
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-foreground to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-foreground to-transparent z-10" />
          <div className="flex gap-2 sm:gap-3 animate-marquee">
            {[...universities, ...universities].map((uni, i) => (
              <span
                key={`${uni}-${i}`}
                className="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-background/15 text-xs sm:text-sm text-background/60 whitespace-nowrap"
              >
                {uni}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Button 
            size="lg" 
            className="rounded-full bg-background text-foreground hover:bg-secondary shadow-elevated hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-base px-8 py-6 w-full sm:w-auto"
            onClick={handleFindStudents}
          >
            Join ErasMatch <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="mt-4 text-sm text-background/50">Your Erasmus starts here. It's free.</p>
        </motion.div>
      </div>
    </section>
  );
};
