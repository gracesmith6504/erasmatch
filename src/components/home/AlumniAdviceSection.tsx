import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlumniAdviceSectionProps {
  handleFindStudents: () => void;
}

const mockQuestions = [
  { text: "What's the student accommodation like?", align: "left" as const },
  { text: "Is it easy to make friends?", align: "right" as const },
  { text: "What should I bring that I wouldn't think of?", align: "left" as const },
];

export const AlumniAdviceSection = ({ handleFindStudents }: AlumniAdviceSectionProps) => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-accent mb-4">
              <MessageCircle className="h-4 w-4" />
              Alumni Advice
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              Learn from those who've{" "}
              <span className="text-accent">been there</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Message students who went to your destination university or city in
              previous semesters. Get real answers about accommodation, nightlife,
              what to pack, and what to actually expect — advice no brochure can
              give you.
            </p>
            <Button
              onClick={handleFindStudents}
              className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Find Your Community
            </Button>
          </motion.div>

          {/* Chat bubbles */}
          <motion.div
            className="flex flex-col gap-4 max-w-md mx-auto lg:mx-0 lg:ml-auto"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {mockQuestions.map((q, i) => (
              <motion.div
                key={i}
                className={`flex ${q.align === "right" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
              >
                <div
                  className={`px-5 py-3.5 rounded-2xl text-sm sm:text-base shadow-md max-w-[85%] ${
                    q.align === "right"
                      ? "bg-accent text-accent-foreground rounded-br-sm"
                      : "bg-card text-card-foreground border border-border rounded-bl-sm"
                  }`}
                >
                  {q.text}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <div className="bg-accent/20 text-accent rounded-2xl rounded-br-sm px-5 py-3 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:0ms]" />
                <span className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:150ms]" />
                <span className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:300ms]" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
