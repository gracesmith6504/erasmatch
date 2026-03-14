import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StudentAvatarProps {
  avatarUrl: string | null;
  name: string | null;
  className?: string;
}

const StudentAvatar = ({ avatarUrl, name, className = "" }: StudentAvatarProps) => {
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <Avatar className={`${className} border-4 border-card shadow-soft ring-2 ring-card/50 group-hover:scale-105 transition-all duration-300`}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl || undefined} loading="lazy" />
      ) : null}
      <AvatarFallback className="text-lg bg-secondary text-foreground">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default StudentAvatar;