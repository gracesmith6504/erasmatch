import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const cities = ["Barcelona", "Lisbon", "Budapest", "Amsterdam", "Prague", "Rome", "Madrid"];

export const AnimatedCityHeadline = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % cities.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] tracking-tight mb-4 sm:mb-6 leading-[1.1] text-foreground font-display">
      <span className="font-extrabold">Connect with Erasmus</span>
      <br />
      <span className="font-extrabold">students in </span>
      <span className="inline-block relative font-extrabold text-accent overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={cities[index]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="inline-block"
          >
            {cities[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  );
};
