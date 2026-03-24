import { useState, useRef } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type PhotoStepProps = {
  onNext: () => void;
  onBack: () => void;
  onUpdateProfile: (data: any) => Promise<boolean>;
};

export const PhotoStep = ({ onNext, onBack, onUpdateProfile }: PhotoStepProps) => {
  const { currentUserProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentUserProfile?.avatar_url || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const name = currentUserProfile?.name || "";

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }

    setUploading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const userId = userData.user.id;
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      if (!publicUrlData.publicUrl) throw new Error("Failed to get public URL");

      setAvatarUrl(publicUrlData.publicUrl);

      const success = await onUpdateProfile({ avatar_url: publicUrlData.publicUrl });
      if (success) {
        toast.success("Photo uploaded!");
        setTimeout(() => onNext(), 600);
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={5} totalSteps={5} onBack={onBack}>
      <div className="flex flex-col items-center text-center space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Add a profile photo</h2>
        <p className="text-muted-foreground text-sm">
          Students with a photo get 3x more connections
        </p>

        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <Avatar className="w-32 h-32 text-3xl font-bold border-4 border-card shadow-md ring-2 ring-border">
            <AvatarImage src={avatarUrl || undefined} alt={name} className="object-cover" />
            <AvatarFallback className="bg-secondary text-foreground text-3xl font-bold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-200">
            <Camera className="h-8 w-8 text-card opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full max-w-xs"
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              Uploading...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Choose a photo
            </span>
          )}
        </Button>

        <button
          type="button"
          onClick={onNext}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
        >
          Skip for now
        </button>
      </div>
    </OnboardingLayout>
  );
};
