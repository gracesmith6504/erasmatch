import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type OnboardingLayoutProps = {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  showBackButton?: boolean;
  title?: string;
};

const STEP_LABELS = ["", "You", "Destination", "Details", "Interests"];

export const OnboardingLayout = ({
  children,
  currentStep,
  totalSteps,
  onBack,
  showBackButton = true,
}: OnboardingLayoutProps) => {
  // Progress fills after completing each step: step 1 shows 0%, after step 4 shows 100%
  const progress = ((currentStep - 1) / totalSteps) * 100;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      {/* Header */}
      <div className="p-4 flex items-center">
        {showBackButton && onBack ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-10" />
        )}
        <div className="flex-1" />
        <div className="w-10" />
      </div>

      {/* Progress bar */}
      <div className="px-6">
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-erasmatch-blue to-erasmatch-green transition-all duration-700 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-end mt-1.5 px-0.5">
          <span className="text-xs text-muted-foreground/70">
            {currentStep === totalSteps ? "Almost there!" : `${currentStep} of ${totalSteps}`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};
