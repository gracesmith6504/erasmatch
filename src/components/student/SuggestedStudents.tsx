import React from "react";
import { Profile } from "@/types";
import { X } from "lucide-react";
import StudentCard from "./StudentCard";

interface SuggestedStudentsProps {
  profiles: Profile[];
  currentUserId: string;
  cityName: string | null;
  universityName: string | null;
  onDismiss: () => void;
}

const SuggestedStudents = ({ profiles, currentUserId, cityName, universityName, onDismiss }: SuggestedStudentsProps) => {
  const others = profiles.filter(p => p.id !== currentUserId);

  // City matches first
  let matches = cityName ? others.filter(p => p.city === cityName) : [];

  // If fewer than 3 city matches, add university matches
  if (matches.length < 3 && universityName) {
    const uniMatches = others.filter(p => p.university === universityName && !matches.some(m => m.id === p.id));
    matches = [...matches, ...uniMatches];
  }

  // Sort: avatar first, then profile completeness
  matches.sort((a, b) => {
    const aAvatar = a.avatar_url ? 1 : 0;
    const bAvatar = b.avatar_url ? 1 : 0;
    if (bAvatar !== aAvatar) return bAvatar - aAvatar;
    const fields = (p: Profile) => [p.name, p.email, p.university, p.avatar_url, p.bio, p.semester, p.home_university, p.city].filter(Boolean).length;
    return fields(b) - fields(a);
  });

  const suggested = matches.slice(0, 4);

  if (suggested.length === 0) return null;

  const headline = cityName || universityName || "your destination";

  return (
    <div className="mb-6 rounded-lg bg-primary/5 border border-primary/10 p-4 sm:p-5 relative">
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </button>

      <h2 className="text-lg font-display font-semibold text-foreground mb-3 pr-8">
        Students also going to {headline}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {suggested.map(profile => (
          <StudentCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedStudents;
