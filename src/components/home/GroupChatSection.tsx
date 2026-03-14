import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface GroupChatSectionProps {
  handleFindStudents: () => void;
}

export const GroupChatSection = ({ handleFindStudents }: GroupChatSectionProps) => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          {/* Chat mockup */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              {/* Chat header */}
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-erasmatch-blue/15 flex items-center justify-center text-sm font-bold text-erasmatch-blue">
                    L
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">Lisbon Group Chat</h3>
                    <p className="text-xs text-muted-foreground">24 members</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-erasmatch-green/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-erasmatch-green" />
                  <span className="text-xs font-medium text-erasmatch-green">12 online</span>
                </div>
              </div>
              
              {/* Messages */}
              <div className="p-5 space-y-4">
                <div className="flex gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-erasmatch-purple/10 flex-shrink-0 flex items-center justify-center text-[10px]">🇩🇪</div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Anna</p>
                    <div className="bg-secondary rounded-xl rounded-tl-sm px-3 py-2">
                      <p className="text-xs text-foreground">Does anyone know good co-working spots near Marquês? ☕</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2.5 justify-end">
                  <div>
                    <div className="bg-foreground rounded-xl rounded-tr-sm px-3 py-2">
                      <p className="text-xs text-background">Try Second Home! It's amazing 🌿</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-erasmatch-coral/10 flex-shrink-0 flex items-center justify-center text-[10px]">🇮🇹</div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Luca</p>
                    <div className="bg-secondary rounded-xl rounded-tl-sm px-3 py-2">
                      <p className="text-xs text-foreground">Who's up for surfing this weekend? 🏄‍♂️</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Typing indicator */}
              <div className="px-5 pb-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-pulse" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-pulse [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-pulse [animation-delay:0.4s]" />
                  </div>
                  <span>3 people typing...</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-medium tracking-widest uppercase text-erasmatch-green mb-3">Group chats</p>
            <h2 className="text-3xl sm:text-4xl mb-6 text-foreground font-display font-bold">
              You're not arriving{" "}
              <span className="text-erasmatch-green">alone.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Join your university and city group chat the moment you sign up. Ask about housing, courses, nightlife — or just say hi. Your Erasmus crew is waiting.
            </p>
            <Button 
              size="lg" 
              className="rounded-full bg-foreground text-primary-foreground hover:bg-foreground/90 shadow-elevated hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              onClick={handleFindStudents}
            >
              Find your group <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
