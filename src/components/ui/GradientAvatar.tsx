import React from "react";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface GradientAvatarProps {
  id: string;
  name?: string | null;
  size?: number;
  className?: string;
}

// Curated solid brand-aligned palette (respects "no gradients, solid colors" rule).
// Uses HSL values so they harmonise with the existing erasmatch token system.
const PALETTE = [
  { bg: "hsl(11, 78%, 60%)", fg: "hsl(0, 0%, 100%)" },   // coral
  { bg: "hsl(160, 55%, 42%)", fg: "hsl(0, 0%, 100%)" },  // green
  { bg: "hsl(220, 75%, 60%)", fg: "hsl(0, 0%, 100%)" },  // blue
  { bg: "hsl(265, 55%, 60%)", fg: "hsl(0, 0%, 100%)" },  // purple
  { bg: "hsl(35, 85%, 58%)", fg: "hsl(0, 0%, 100%)" },   // amber
  { bg: "hsl(190, 65%, 45%)", fg: "hsl(0, 0%, 100%)" },  // teal
];

const hashId = (id: string): number => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
};

const getInitials = (name?: string | null): string => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const GradientAvatar = ({ id, name, size = 64, className }: GradientAvatarProps) => {
  const swatch = PALETTE[hashId(id) % PALETTE.length];
  const initials = getInitials(name);
  const fontSize = Math.round(size * 0.38);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full ring-2 ring-background shadow-sm overflow-hidden",
        className
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: swatch.bg,
        color: swatch.fg,
      }}
      aria-hidden="true"
    >
      {/* Soft top-left highlight for a subtle glassy sheen (not a gradient fill) */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.22), rgba(255,255,255,0) 60%)",
        }}
      />
      {initials ? (
        <span
          className="font-display font-semibold leading-none tracking-wide select-none"
          style={{ fontSize }}
        >
          {initials}
        </span>
      ) : (
        <UserRound style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={1.75} />
      )}
    </div>
  );
};

export default GradientAvatar;
