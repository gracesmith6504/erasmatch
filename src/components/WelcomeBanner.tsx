
import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface WelcomeBannerProps {
  cityName: string | null;
  variant?: "default" | "groups";
}

export const WelcomeBanner = ({ cityName, variant = "default" }: WelcomeBannerProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Alert className="mb-6 relative pr-10">
      <AlertTitle className="text-lg font-medium">
        Welcome to {cityName || "ErasMatch"}!
      </AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>Profiles with photos get more attention — want to add yours?</p>
        <div className="mt-2">
          <Button asChild size="sm">
            <Link to="/profile">Add a photo</Link>
          </Button>
        </div>
      </AlertDescription>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </button>
    </Alert>
  );
};
