import { UserCheck, MessageSquare, Compass, Globe } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: UserCheck,
    title: "Match with students",
    description: "Find others heading to your city or university before you arrive.",
    color: "bg-erasmatch-green/10 text-erasmatch-green",
  },
  {
    icon: MessageSquare,
    title: "Join group chats",
    description: "City and university conversations that feel like home from day one.",
    color: "bg-erasmatch-blue/10 text-erasmatch-blue",
  },
  {
    icon: Compass,
    title: "Make plans",
    description: "Find travel buddies, roommates, and friends before your semester starts.",
    color: "bg-erasmatch-coral/10 text-erasmatch-coral",
  },
  {
    icon: Globe,
    title: "Stay connected",
    description: "Keep in touch throughout your entire exchange experience.",
    color: "bg-erasmatch-purple/10 text-erasmatch-purple",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium tracking-widest uppercase text-erasmatch-green mb-3">Why ErasMatch</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground text-balance">
            Not just where you're going.
            <br className="hidden sm:block" />
            <span className="text-erasmatch-green"> Who you're going with.</span>
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative p-6 rounded-2xl bg-background border border-border hover:border-border/80 hover:shadow-card hover:scale-[1.03] transition-all duration-300 cursor-default"
            >
              <div className={`h-11 w-11 rounded-xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
