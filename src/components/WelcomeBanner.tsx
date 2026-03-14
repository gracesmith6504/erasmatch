import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Camera } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface WelcomeBannerProps {
  cityName: string | null;
  variant?: "default" | "groups";
  hasAvatar?: boolean;
}

export const WelcomeBanner = ({ cityName, variant = "default", hasAvatar = false }: WelcomeBannerProps) => {
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    const isDismissed = localStorage.getItem("welcomeBannerDismissed");
    if (isDismissed === "true") {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("welcomeBannerDismissed", "true");
    sessionStorage.removeItem("justCompletedOnboarding");
  };

  if (dismissed || (hasAvatar && variant !== "groups")) return null;

  return (
    <Alert className="mb-6 relative pr-10 bg-erasmatch-green/10 border-erasmatch-green/20">
      <AlertTitle className="text-lg font-display font-semibold flex items-center text-foreground">
        <span className="truncate pr-1">Welcome to {cityName || "ErasMatch"}!</span>
      </AlertTitle>
      <AlertDescription className="flex flex-col gap-2 text-muted-foreground">
        {!hasAvatar && (
          <>
            <p>Profiles with photos get more attention — want to add yours?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button asChild size="sm" className="bg-foreground text-background hover:bg-foreground/90 rounded-full">
                <Link to="/profile">
                  <Camera className="h-4 w-4 mr-2" />
                  Add a photo
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full border-border">
                <Link to="/groups">
                  Browse groups
                </Link>
              </Button>
            </div>
          </>
        )}
        {hasAvatar && (
          <>
            <p>Thanks for completing your profile! Connect with your Erasmus peers:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline" className="rounded-full border-border">
                <Link to="/groups">
                  Browse groups
                </Link>
              </Button>
            </div>
          </>
        )}
      </AlertDescription>
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </button>
    </Alert>
  );
};