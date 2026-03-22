import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatedCityHeadline } from "./hero/AnimatedCityHeadline";
import { PhoneMockup } from "./hero/PhoneMockup";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HeroSectionProps {
  handleFindStudents: () => void;
  handleJoinChats: () => void;
  handlePlanning: () => void;
}

export const HeroSection = ({
  handleFindStudents
}: HeroSectionProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [featuredAvatars, setFeaturedAvatars] = useState<string[]>([]);

  useEffect(() => {
    supabase.
    rpc("get_featured_activity_profiles").
    then(({ data }) => {
      if (data) {
        setFeaturedAvatars(
          data.filter((p) => p.avatar_url).map((p) => p.avatar_url!)
        );
      }
    });
  }, []);

  const handleAuthAction = () => {
    navigate(isAuthenticated ? "/students" : "/auth?mode=signup");
  };

  return (
    <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }} />
      

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            className="text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            
            <AnimatedCityHeadline />

            {/* Featured student avatars */}
            {featuredAvatars.length > 0 &&
            <motion.div
              className="mt-6 mb-8 sm:mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}>
              
                <div className="flex items-center">
                  {featuredAvatars.map((url, i) =>
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="w-9 h-9 rounded-full border-2 border-background object-cover"
                  style={{ marginLeft: i === 0 ? 0 : -8 }} />

                )}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">600+ students already joined   </p>
              </motion.div>
            }

            {featuredAvatars.length === 0 && <div className="mb-8 sm:mb-10" />}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
              <Button
                size="lg"
                className="text-base px-8 py-6 bg-foreground text-primary-foreground hover:bg-foreground/90 rounded-full shadow-elevated transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto"
                onClick={handleAuthAction}>
                
                {isAuthenticated ? "Explore Students" : "Join free - takes 10 sec"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 rounded-full border-border hover:bg-secondary hover:text-foreground w-full sm:w-auto"
                onClick={handleFindStudents}>
                
                See who's going
              </Button>
            </div>

            {!isAuthenticated &&
            <p className="text-sm text-muted-foreground">
                Already a member?{" "}
                <Link
                to="/auth?mode=login"
                className="underline underline-offset-4 hover:text-foreground transition-colors">
                
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
                <p className="text-xl sm:text-2xl font-bold text-foreground">50+</p>
                <p className="text-xs text-muted-foreground">Countries</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center sm:text-left">
                <p className="text-xl sm:text-2xl font-bold text-foreground">500+</p>
                <p className="text-xs text-muted-foreground">Universities</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side floating activity card */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            
            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>);

};