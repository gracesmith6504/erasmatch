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

export const OnboardingLayout = ({
  children,
  currentStep,
  totalSteps,
  onBack,
  showBackButton = true,
  title,
}: OnboardingLayoutProps) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      {/* Header */}
      <div className="p-4 flex items-center">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1">
          {title && <h2 className="text-lg font-display font-semibold text-center text-foreground">{title}</h2>}
        </div>
        <div className="w-10"></div>
      </div>

      {/* Progress bar */}
      <div className="px-4">
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-erasmatch-green to-erasmatch-blue transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 px-1 text-xs text-muted-foreground">
          <span>Start</span>
          <span>Step {currentStep} of {totalSteps}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md transition-all duration-300 ease-out animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
};