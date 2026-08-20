import { useState, useRef, useEffect } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { transformAvatarUrl } from "@/lib/avatar";
import { Camera, Upload, Loader2, MapPin, Eye, EyeOff, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import GradientAvatar from "@/components/ui/GradientAvatar";

type PhotoStepProps = {
  onNext: () => void;
  onBack: () => void;
  onUpdateProfile: (data: any) => Promise<boolean>;
};

// Mini preview of how the user's profile card appears to other students.
// Shows a simplified version of the StudentCard — the "with photo" variant
// looks vibrant and complete, the "without photo" variant looks muted.
const ProfilePreview = ({
  name,
  city,
  avatarUrl,
  userId,
  withPhoto,
}: {
  name: string;
  city: string | null;
  avatarUrl: string | null;
  userId: string;
  withPhoto: boolean;
}) => {
  const firstName = name?.split(" ")[0] || "You";

  return (
    <div
      className={`relative rounded-xl border px-4 py-3.5 w-full max-w-[200px] transition-all duration-500 ${
        withPhoto
          ? "border-primary/30 bg-card shadow-md scale-[1.03]"
          : "border-border/50 bg-muted/30 opacity-60 scale-[0.97]"
      }`}
    >
      {/* Priority badge */}
      <div
        className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap transition-all duration-500 ${
          withPhoto
            ? "bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/20"
            : "bg-muted text-muted-foreground/50 border border-border/50"
        }`}
      >
        {withPhoto ? (
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Shown first
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <EyeOff className="h-3 w-3" />
            Hidden below
          </span>
        )}
      </div>

      {/* Avatar + Name row */}
      <div className="flex items-center gap-2.5 mt-1">
        {withPhoto && avatarUrl ? (
          <Avatar className="h-11 w-11 ring-1 ring-border shadow-sm">
            <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
            <AvatarFallback>
              <GradientAvatar id={userId} name={name} size={44} className="ring-0 shadow-none" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <GradientAvatar
            id={userId}
            name={name}
            size={44}
            className={withPhoto ? "" : "opacity-50"}
          />
        )}
        <div className="min-w-0">
          <p className={`font-bold text-sm truncate ${withPhoto ? "text-foreground" : "text-muted-foreground"}`}>
            {firstName}
          </p>
          {city && (
            <p className={`flex items-center gap-1 text-[11px] truncate ${withPhoto ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
              <MapPin className="h-3 w-3 shrink-0" />
              {city}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const PhotoStep = ({ onNext, onBack, onUpdateProfile }: PhotoStepProps) => {
  const { currentUserProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentUserProfile?.avatar_url || null);
  const [uploadPhase, setUploadPhase] = useState<"idle" | "compressing" | "uploading">("idle");
  const uploading = uploadPhase !== "idle";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [featuredProfiles, setFeaturedProfiles] = useState<{ avatar_url: string; first_name: string }[]>([]);
  const [showSkip, setShowSkip] = useState(false);

  const name = currentUserProfile?.name || "";
  const city = currentUserProfile?.city || null;
  const userId = currentUserProfile?.id || "unknown";

  // Fetch featured profiles for social proof avatars
  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase.rpc("get_featured_activity_profiles");
      if (data && data.length > 0) {
        setFeaturedProfiles(data.slice(0, 5));
      }
    };
    fetchFeatured();
  }, []);

  // Delay the skip option — gives the upload CTA time to work.
  // Research shows delayed skip increases upload rates by up to 50%.
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File too large. Please choose a photo under 50 MB.");
      return;
    }

    setUploadPhase("compressing");

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      const { compressAvatar } = await import("@/lib/avatar");
      const compressed = await compressAvatar(file);

      setUploadPhase("uploading");

      const fileUserId = userData.user.id;
      const fileExt = compressed.name.split(".").pop();
      const fileName = `${fileUserId}/${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, compressed, { cacheControl: "31536000", upsert: false, contentType: compressed.type });

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
      setUploadPhase("idle");
    }
  };

  const hasUploaded = !!avatarUrl;

  return (
    <OnboardingLayout currentStep={6} totalSteps={6} onBack={onBack}>
      <div className="flex flex-col items-center text-center space-y-5">
        {/* Headline — benefit-led, personalized */}
        <div>
          <div className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold tracking-wide uppercase mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Last step
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {city ? `Stand out in ${city}` : "Make your profile stand out"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1.5">
            Profiles with a photo are <strong className="text-foreground">shown first</strong> to everyone
          </p>
        </div>

        {/* Profile preview comparison — shows what others see */}
        <div className="flex items-center gap-3 w-full justify-center py-1">
          <ProfilePreview
            name={name}
            city={city}
            avatarUrl={null}
            userId={userId}
            withPhoto={false}
          />
          <ProfilePreview
            name={name}
            city={city}
            avatarUrl={avatarUrl}
            userId={userId}
            withPhoto={true}
          />
        </div>

        {/* Upload area — clickable avatar when no photo, success state when uploaded */}
        {!hasUploaded && (
          <div
            className={`relative group ${uploading ? "pointer-events-none" : "cursor-pointer"}`}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <Avatar className="w-24 h-24 text-2xl font-bold border-4 border-card shadow-md ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">
                <Camera className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/50 backdrop-blur-[2px]">
                <Loader2 className="h-7 w-7 text-card animate-spin" />
              </div>
            )}
          </div>
        )}

        {hasUploaded && (
          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-24 h-24 text-2xl font-bold border-4 border-card shadow-md ring-2 ring-green-500/30">
              <AvatarImage src={avatarUrl!} alt={name} className="object-cover" />
              <AvatarFallback className="bg-secondary text-foreground text-2xl font-bold">
                ✓
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              Looking great! ✨
            </span>
          </div>
        )}

        {/* Social proof */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {featuredProfiles.map((p, i) => (
                <Avatar key={i} className="w-7 h-7 border-2 border-card">
                  <AvatarImage src={transformAvatarUrl(p.avatar_url)} alt={p.first_name} className="object-cover" />
                  <AvatarFallback className="text-[10px] bg-muted">{p.first_name?.[0]}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              Join 1,000+ students already on ErasMatch
            </span>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Primary CTA */}
        {!hasUploaded && (
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            size="lg"
            className="w-full max-w-xs"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploadPhase === "compressing" ? "Optimizing photo…" : "Uploading…"}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Add my photo
              </span>
            )}
          </Button>
        )}

        {/* Delayed skip — fades in after 4 seconds */}
        <span
          onClick={onNext}
          className={`text-[10px] text-muted-foreground/40 cursor-pointer select-none transition-opacity duration-700 ${
            showSkip ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          role="button"
          tabIndex={showSkip ? 0 : -1}
          onKeyDown={(e) => e.key === "Enter" && onNext()}
        >
          skip
        </span>
      </div>
    </OnboardingLayout>
  );
};
