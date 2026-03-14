import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { differenceInDays } from "date-fns";

interface StudentAvatarProps {
  avatarUrl: string | null;
  name: string | null;
  className?: string;
  lastActiveAt?: string | null;
}

const StudentAvatar = ({ avatarUrl, name, className = "", lastActiveAt }: StudentAvatarProps) => {
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
        {avatarUrl ? (
          <AvatarImage src={avatarUrl || undefined} loading="lazy" />
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