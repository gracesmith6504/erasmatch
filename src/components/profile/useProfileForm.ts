
import { useState } from "react";
import { useProfileContext } from "./context";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";


export const useProfileForm = () => {
  const context = useProfileContext();
  const [uploadStatus, setUploadStatus] = useState({
    uploading: false,
    error: null as string | null,
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(context.form.avatar_url);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

// Compress + resize
    const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };


    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({
        uploading: false,
        error: "File too large. Maximum size is 5MB."
      });
      return;
    }

    setUploadStatus({ uploading: true, error: null });

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");
      
      const userId = userData.user.id;
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${uuidv4()}.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      if (!publicUrlData.publicUrl) throw new Error("Failed to get public URL");
      
      // Update the form state with the new avatar URL
      context.handleSelectChange("avatar_url", publicUrlData.publicUrl);
      setAvatarUrl(publicUrlData.publicUrl);
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      setUploadStatus({
        uploading: false,
        error: error.message || "Failed to upload image"
      });
    } finally {
      setUploadStatus((prev) => ({ ...prev, uploading: false }));
    }
  };

  const handleRemoveAvatar = () => {
    context.handleSelectChange("avatar_url", null);
    setAvatarUrl(null);
  };

  const handlePersonalityTagToggle = (tag: string) => {
    const currentTags = context.form.personality_tags || [];
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    context.handleSelectChange("personality_tags", updatedTags);
  };

  return {
    ...context,
    handleFileUpload,
    uploadStatus,
    avatarUrl,
    handleRemoveAvatar,
    handlePersonalityTagToggle
  };
};
