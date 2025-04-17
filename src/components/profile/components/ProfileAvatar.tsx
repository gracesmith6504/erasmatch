
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

type ProfileAvatarProps = {
  name: string | null;
  avatarUrl: string | null;
  uploadStatus: {
    uploading: boolean;
    error: string | null;
  };
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ProfileAvatar = ({
  name,
  avatarUrl,
  uploadStatus,
  handleFileUpload,
}: ProfileAvatarProps) => {
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
    <div className="relative">
      <Avatar className="w-24 h-24 rounded-full mx-auto text-xl font-bold bg-indigo-100 text-indigo-700 flex items-center justify-center">
        <AvatarImage
          src={avatarUrl || undefined}
          alt={name || "Profile"}
          className="w-full h-full object-cover"
          width={96}
          height={96}
          loading="lazy"
          decoding="async"
        />

        <AvatarFallback className="flex items-center justify-center">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      
      <div className="mt-2">
        {!uploadStatus.uploading ? (
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="mt-2 text-sm text-indigo-600 hover:underline text-center block">
              {avatarUrl ? "Change Photo" : "Upload Photo"}
            </div>
            <Input 
              id="avatar-upload" 
              type="file" 
              accept="image/*"
              className="hidden" 
              onChange={handleFileUpload}
            />
          </label>
        ) : (
          <div className="text-sm text-gray-500">Uploading...</div>
        )}
      </div>
      
      {uploadStatus.error && (
        <p className="text-xs text-red-500 mt-1">{uploadStatus.error}</p>
      )}
    </div>
  );
};
