import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import ImageModal from "@/components/shared/ImageModal";
import React from "react";
import { toast } from "sonner";

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

  const handleCropComplete = async (croppedImage: string) => {
    try {
      // Convert base64 to blob
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      
      // Create a File object from the blob
      const file = new File([blob], 'profile-picture.png', { type: 'image/png' });
      
      // Use the existing file upload handler
      const event = { target: { files: [file] } } as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(event);
    } catch (error) {
      console.error('Error processing cropped image:', error);
      toast.error("Failed to save cropped image. Please try again.");
    }
  };

  return (
    <div className="relative">
      <div 
        onClick={() => avatarUrl && setIsModalOpen(true)}
        className={avatarUrl ? "cursor-pointer transition-transform hover:scale-105" : ""}
      >
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
      </div>
      
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

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={avatarUrl}
        showEditButton={true}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};
