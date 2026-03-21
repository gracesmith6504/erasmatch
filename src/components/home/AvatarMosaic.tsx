import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface MosaicProfile {
  id: string;
  avatar_url: string;
  name: string | null;
}

const CITY_LABELS = ["Barcelona", "Lisbon", "Berlin", "Amsterdam", "Prague", "Budapest"];

const SIZES = [
  "h-12 w-12",
  "h-14 w-14",
  "h-10 w-10",
  "h-16 w-16",
  "h-11 w-11",
  "h-13 w-13",
];

const MOBILE_SIZES = [
  "h-9 w-9",
  "h-10 w-10",
  "h-8 w-8",
  "h-11 w-11",
  "h-9 w-9",
  "h-10 w-10",
];

export const AvatarMosaic = () => {
  const [profiles, setProfiles] = useState<MosaicProfile[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, avatar_url, name")
        .not("avatar_url", "is", null)
        .is("deleted_at", null)
        .limit(30);

      if (data) {
        setProfiles(data.filter((p) => p.avatar_url) as MosaicProfile[]);
      }
    };
    fetch();
  }, []);

  if (profiles.length === 0) return null;

  return (
    <>
      {/* Desktop mosaic */}
      <div className="hidden lg:block relative w-full max-w-md mx-auto min-h-[380px]">
        <MosaicGrid profiles={profiles} sizes={SIZES} avatarSizeBase={56} />
      </div>

      {/* Mobile condensed mosaic */}
      <div className="lg:hidden relative w-full max-w-sm mx-auto min-h-[180px] mt-8">
        <MosaicGrid
          profiles={profiles.slice(0, 18)}
          sizes={MOBILE_SIZES}
          avatarSizeBase={40}
          compact
        />
      </div>
    </>
  );
};

interface MosaicGridProps {
  profiles: MosaicProfile[];
  sizes: string[];
  avatarSizeBase: number;
  compact?: boolean;
}

const MosaicGrid = ({ profiles, sizes, compact }: MosaicGridProps) => {
  // Place city labels at specific positions
  const cityPositions = compact
    ? [
        { top: "5%", left: "15%" },
        { top: "45%", right: "8%" },
        { bottom: "10%", left: "25%" },
      ]
    : [
        { top: "2%", left: "20%" },
        { top: "25%", right: "5%" },
        { top: "55%", left: "5%" },
        { bottom: "15%", right: "15%" },
        { top: "40%", left: "35%" },
        { bottom: "5%", left: "55%" },
      ];

  const visibleCities = compact ? CITY_LABELS.slice(0, 3) : CITY_LABELS;

  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Avatar grid */}
      <div
        className={`flex flex-wrap gap-2 ${compact ? "gap-1.5" : "gap-2.5"} justify-center items-center`}
      >
        {profiles.map((profile, i) => {
          const sizeClass = sizes[i % sizes.length];
          const driftDelay = (i * 0.7) % 8;
          const driftY = i % 3 === 0 ? 4 : i % 3 === 1 ? -3 : 2;

          return (
            <motion.div
              key={profile.id}
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, driftY, 0, -driftY * 0.5, 0],
              }}
              transition={{
                opacity: { duration: 0.4, delay: i * 0.04 },
                scale: { duration: 0.4, delay: i * 0.04 },
                y: {
                  duration: 6 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: driftDelay,
                },
              }}
            >
              <img
                src={profile.avatar_url}
                alt={profile.name || "Student"}
                loading="lazy"
                className={`${sizeClass} rounded-full object-cover border-2 border-card shadow-soft`}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Floating city labels */}
      {visibleCities.map((city, i) => {
        const pos = cityPositions[i] || {};
        const driftDelay = 1 + i * 1.2;

        return (
          <motion.span
            key={city}
            className={`absolute ${compact ? "text-[10px]" : "text-xs"} font-medium text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-border shadow-sm pointer-events-none z-10`}
            style={pos as React.CSSProperties}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              y: [0, -3, 0, 2, 0],
            }}
            transition={{
              opacity: { duration: 0.5, delay: 0.6 + i * 0.15 },
              y: {
                duration: 7 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: driftDelay,
              },
            }}
          >
            {city}
          </motion.span>
        );
      })}
    </motion.div>
  );
};
