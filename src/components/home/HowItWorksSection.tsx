import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Create your profile",
    description: "Tell us where you're going, what you study, and what you're into.",
    accent: "bg-erasmatch-green",
  },
  {
    number: "02",
    title: "Discover students",
    description: "Browse who's heading to your city or university this semester.",
    accent: "bg-erasmatch-blue",
  },
  {
    number: "03",
    title: "Start connecting",
    description: "Message, join group chats, and make plans before you even arrive.",
    accent: "bg-erasmatch-coral",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium tracking-widest uppercase text-erasmatch-green mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Three steps to your <span className="text-erasmatch-green">Erasmus crew.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px border-t border-dashed border-border" />
              )}
              
              <div className="relative p-6 rounded-2xl hover:bg-card hover:shadow-card hover:scale-[1.03] transition-all duration-300 cursor-default">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${step.accent}/10 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className={`text-lg font-bold ${step.accent === 'bg-erasmatch-green' ? 'text-erasmatch-green' : step.accent === 'bg-erasmatch-blue' ? 'text-erasmatch-blue' : 'text-erasmatch-coral'}`}>
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
