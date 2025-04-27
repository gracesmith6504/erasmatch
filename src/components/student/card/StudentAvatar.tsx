
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ImageModal from "@/components/shared/ImageModal";

interface StudentAvatarProps {
  avatarUrl: string | null;
  name: string | null;
  className?: string;
}

const StudentAvatar = ({ avatarUrl, name, className = "" }: StudentAvatarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
    <>
      <div 
        onClick={() => avatarUrl && setIsModalOpen(true)}
        className={avatarUrl ? "cursor-pointer transition-transform hover:scale-105" : ""}
      >
        <Avatar className={`${className} border-4 border-white shadow-md ring-2 ring-white/50 group-hover:scale-105 transition-all duration-300`}>
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback className="text-lg bg-gradient-to-br from-blue-100 to-purple-100 text-erasmatch-blue">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={avatarUrl}
      />
    </>
  );
};

export default StudentAvatar;
