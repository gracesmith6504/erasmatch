
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Camera, Loader2 } from "lucide-react";

type ProfileAvatarProps = {
  name: string | null;
  avatarUrl: string | null;
  uploadStatus: {
    phase?: "idle" | "compressing" | "uploading";
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

  const phase = uploadStatus.phase ?? (uploadStatus.uploading ? "uploading" : "idle");
  const isBusy = phase !== "idle";
  const phaseLabel =
    phase === "compressing" ? "Optimizing photo…" : phase === "uploading" ? "Uploading…" : "";

  return (
    <div className="relative inline-block">
      <label htmlFor="avatar-upload" className={`group block ${isBusy ? "pointer-events-none" : "cursor-pointer"}`}>
        <div className="relative w-28 h-28 mx-auto">
          <Avatar className="w-28 h-28 rounded-full text-2xl font-bold border-4 border-card shadow-md ring-2 ring-border">
            <AvatarImage
              src={avatarUrl || undefined}
              alt={name || "Profile"}
              className="w-full h-full object-cover"
              width={112}
              height={112}
              loading="lazy"
              decoding="async"
            />
            <AvatarFallback className="flex items-center justify-center bg-[hsl(var(--erasmatch-blue)/0.12)] text-[hsl(var(--erasmatch-blue))] text-2xl font-bold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          {/* Loading overlay */}
          {isBusy && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/50 backdrop-blur-[2px]">
              <Loader2 className="h-7 w-7 text-card animate-spin" />
            </div>
          )}

          {/* Camera overlay on hover (only when idle) */}
          {!isBusy && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-200">
              <Camera className="h-6 w-6 text-card opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          )}
        </div>

        <Input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isBusy}
        />
      </label>

      {isBusy && (
        <div className="mt-2 text-sm text-muted-foreground text-center flex items-center justify-center gap-1.5">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {phaseLabel}
        </div>
      )}

      {!isBusy && uploadStatus.error && (
        <p className="text-xs text-destructive mt-1 text-center">{uploadStatus.error}</p>
      )}
    </div>
  );
};
