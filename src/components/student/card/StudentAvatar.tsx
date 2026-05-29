import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { differenceInDays } from "date-fns";
import { transformAvatarUrl } from "@/lib/avatar";

interface StudentAvatarProps {
  avatarUrl: string | null;
  name: string | null;
  className?: string;
  lastActiveAt?: string | null;
  priority?: boolean;
}

const StudentAvatar = ({ avatarUrl, name, className = "", lastActiveAt, priority = false }: StudentAvatarProps) => {
  const fallbackSrc = avatarUrl || undefined;
  const [avatarSrc, setAvatarSrc] = useState(() => transformAvatarUrl(avatarUrl, 72));

  useEffect(() => {
    setAvatarSrc(transformAvatarUrl(avatarUrl, 72));
  }, [avatarUrl]);

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const isActive = lastActiveAt
    ? differenceInDays(new Date(), new Date(lastActiveAt)) <= 21
    : false;

  return (
    <div className="relative">
      <Avatar className={`${className} border-4 border-card shadow-soft ring-2 ring-card/50 group-hover:scale-105 transition-all duration-300`}>
        {avatarSrc ? (
          <img
            key={avatarSrc}
            src={avatarSrc}
            alt={name || "Student profile photo"}
            className="aspect-square h-full w-full object-cover"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            onError={() => {
              if (fallbackSrc && avatarSrc !== fallbackSrc) {
                setAvatarSrc(fallbackSrc);
              } else {
                setAvatarSrc(undefined);
              }
            }}
          />
        ) : null}
        <AvatarFallback className="text-lg bg-secondary text-foreground">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      {isActive && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
      )}
    </div>
  );
};

export default StudentAvatar;