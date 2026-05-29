import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface AlumniAdviceSectionProps {
  handleFindStudents: () => void;
}

export const AlumniAdviceSection = ({ handleFindStudents }: AlumniAdviceSectionProps) => {
  return (
    <section className="py-16 sm:py-24 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Text content */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-erasmatch-green mb-3">
              Ask an alum
            </p>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-4 sm:mb-6">
              The student who lived there{" "}
              <span className="text-erasmatch-green">last semester.</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8">
              Find profiles of students who did their exchange at your destination, and message them directly. Not reviews. Not ratings. Just one-to-one chats with someone who was there.
            </p>
            <Button
              onClick={handleFindStudents}
              size="lg"
              className="rounded-full bg-foreground text-primary-foreground hover:bg-foreground/90 shadow-elevated hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
            >
              Browse alumni profiles
            </Button>
          </motion.div>

          {/* Oversized DM exchange — one question, one detailed reply */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              {/* DM header — alumna profile */}
              <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-border flex items-center gap-4">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-erasmatch-green/15 flex items-center justify-center text-base sm:text-lg font-bold text-erasmatch-green flex-shrink-0">
                  EV
                </div>
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-foreground truncate">
                    Eline V.
                  </p>
                  <p className="text-xs sm:text-[13px] text-muted-foreground truncate">
                    KU Leuven &rarr; UPF Barcelona &middot; Spring 2025
                  </p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-erasmatch-green/10 flex-shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-erasmatch-green" />
                  <span className="text-[11px] sm:text-xs font-medium text-erasmatch-green">Alumna</span>
                </span>
              </div>

              {/* DM thread */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Outbound question */}
                <div className="flex justify-end">
                  <div className="max-w-[88%] bg-foreground text-background rounded-2xl rounded-tr-sm px-4 py-3">
                    <p className="text-sm sm:text-[15px] leading-relaxed">
                      Hey! Heading to UPF next spring. Any advice on neighbourhoods that won&apos;t bankrupt me but aren&apos;t a 40-min commute?
                    </p>
                  </div>
                </div>

                {/* Inbound reply */}
                <div className="flex justify-start">
                  <div className="max-w-[88%] bg-secondary text-foreground rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-sm sm:text-[15px] leading-relaxed">
                      Gr&agrave;cia if you want the local feel, Poblenou if you want closer to UPF and the beach. Avoid Eixample for short stays &mdash; rent has gotten brutal. Happy to share my landlord&apos;s contact if you want.
                    </p>
                  </div>
                </div>

                {/* Outbound short follow-up */}
                <div className="flex justify-end">
                  <div className="max-w-[60%] bg-foreground text-background rounded-2xl rounded-tr-sm px-4 py-3">
                    <p className="text-sm sm:text-[15px]">that would be amazing 🙏</p>
                  </div>
                </div>
              </div>

              {/* Composer */}
              <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                <div className="flex items-center gap-3 border border-border rounded-full pl-4 pr-1.5 py-1.5">
                  <span className="text-xs sm:text-sm text-muted-foreground flex-1 truncate">
                    Reply to Eline...
                  </span>
                  <span className="h-7 w-7 rounded-full bg-erasmatch-green flex items-center justify-center text-background text-xs">
                    &rarr;
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
