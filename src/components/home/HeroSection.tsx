import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ShareButton } from "@/components/share/ShareButton";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

interface HeroSectionProps {
  handleFindStudents: () => void;
  handleJoinChats: () => void;
  handlePlanning: () => void;
}

export const HeroSection = ({
  handleFindStudents,
  handleJoinChats,
  handlePlanning
}: HeroSectionProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    navigate(isAuthenticated ? "/students" : "/auth?mode=signup");
  };

  return (
    <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Subtle grain texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`
      }} />

      {/* Decorative blobs — smaller on mobile */}
      <div className="absolute top-20 right-[15%] w-40 h-40 sm:w-72 sm:h-72 rounded-full bg-erasmatch-green/10 blur-3xl" />
      <div className="absolute bottom-20 left-[10%] w-52 h-52 sm:w-96 sm:h-96 rounded-full bg-erasmatch-blue/8 blur-3xl" />
      <div className="absolute top-1/2 right-[5%] w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-erasmatch-coral/8 blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
        <div className="hidden sm:flex justify-end mb-6">
          <ShareButton showText={true} link="https://erasmatch.com" />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            className="text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card mb-6 sm:mb-8">
              
              <span className="h-2 w-2 rounded-full bg-erasmatch-green animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Free for all students </span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl tracking-tight mb-4 sm:mb-6 leading-[1.08] text-foreground font-display">
              <span className="font-extrabold">Erasmus</span>{" "}
              <span className="font-medium">just got</span>
              <br />
              <span className="font-extrabold gradient-text">social.</span>
            </h1>
            
            <p className="text-base sm:text-xl max-w-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed">
              Meet your Erasmus mates before you even arrive.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
              <Button
                size="lg"
                className="text-base px-8 py-6 bg-foreground text-primary-foreground hover:bg-foreground/90 rounded-full shadow-elevated transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto"
                onClick={handleAuthAction}>
                
                {isAuthenticated ? "Explore Students" : "Join for free"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 rounded-full border-border hover:bg-secondary hover:text-foreground w-full sm:w-auto"
                onClick={handleFindStudents}>
                
                See how it works
              </Button>
            </div>
            
            {!isAuthenticated &&
            <p className="text-sm text-muted-foreground">
                Already a member?{" "}
                <Link to="/auth?mode=login" className="underline underline-offset-4 hover:text-foreground transition-colors">
                  Log in
                </Link>
              </p>
            }

            {/* Social proof strip */}
            <motion.div
              className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 mt-8 pt-6 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}>
              
              <div className="text-center sm:text-left">
                <p className="text-xl sm:text-2xl font-bold text-foreground">600+</p>
                <p className="text-xs text-muted-foreground">Students joined</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center sm:text-left">
                <p className="text-xl sm:text-2xl font-bold text-foreground">18+</p>
                <p className="text-xs text-muted-foreground">Countries</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center sm:text-left">
                <p className="text-xl sm:text-2xl font-bold text-foreground">500+</p>
                <p className="text-xs text-muted-foreground">Universities</p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right side — Social proof cards (hidden on mobile) */}
          <motion.div
            className="hidden lg:block relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            
            <div className="relative w-full max-w-md mx-auto">
              {/* Floating cards */}
              <motion.div
                className="bg-card rounded-2xl p-5 shadow-card border border-border"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-erasmatch-green/15 flex items-center justify-center text-sm font-bold text-erasmatch-green">L</div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">Lisbon Group Chat</p>
                    <p className="text-xs text-muted-foreground">12 students online</p>
                  </div>
                  <div className="ml-auto flex -space-x-1.5">
                    <div className="h-6 w-6 rounded-full bg-erasmatch-blue/20 border-2 border-card" />
                    <div className="h-6 w-6 rounded-full bg-erasmatch-coral/20 border-2 border-card" />
                    <div className="h-6 w-6 rounded-full bg-erasmatch-purple/20 border-2 border-card" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex gap-2">
                    <div className="h-7 w-7 rounded-full bg-erasmatch-purple/10 flex-shrink-0" />
                    <div className="bg-secondary rounded-xl rounded-tl-sm px-3 py-2 max-w-[75%]">
                      <p className="text-xs text-foreground/80">Anyone found a flat near Técnico? 🏠</p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <div className="bg-foreground text-background rounded-xl rounded-tr-sm px-3 py-2 max-w-[75%]">
                      <p className="text-xs">Check out Uniplaces! I just signed a place in Santos 🎉</p>
                    </div>
                    <div className="h-7 w-7 rounded-full bg-erasmatch-green/10 flex-shrink-0" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-7 w-7 rounded-full bg-erasmatch-orange/10 flex-shrink-0" />
                    <div className="bg-secondary rounded-xl rounded-tl-sm px-3 py-2 max-w-[75%]">
                      <p className="text-xs text-foreground/80">Let's do a welcome dinner the first week! 🍽️</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Notification card */}
              <motion.div
                className="absolute -bottom-6 -left-8 bg-card rounded-xl p-3.5 shadow-elevated border border-border max-w-[220px]"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
                
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-erasmatch-coral/15 flex items-center justify-center">
                    <span className="text-xs">🇫🇷</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">Julia just joined</p>
                    <p className="text-[10px] text-muted-foreground">Paris → Lisbon</p>
                  </div>
                </div>
              </motion.div>

              {/* Match card */}
              <motion.div
                className="absolute -top-4 -right-6 bg-card rounded-xl p-3.5 shadow-elevated border border-border"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}>
                
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-erasmatch-green/15 flex items-center justify-center">
                    <span className="text-sm">✨</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">3 new matches</p>
                    <p className="text-[10px] text-muted-foreground">Same university!</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

};