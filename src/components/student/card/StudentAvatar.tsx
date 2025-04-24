
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
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Avatar className={`${className} border-4 border-white shadow-md ring-2 ring-white/50 group-hover:scale-105 transition-all duration-300`}>
      <AvatarImage src={avatarUrl || undefined} />
      <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-erasmatch-blue/20 to-erasmatch-purple/20 text-erasmatch-blue">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default StudentAvatar;
