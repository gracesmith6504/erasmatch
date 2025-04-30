
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
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <div className="p-4 flex items-center">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-2 text-gray-500"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1">
          {title && <h2 className="text-lg font-medium text-center">{title}</h2>}
        </div>
        <div className="w-10"></div> {/* Spacer to center the title */}
      </div>

      {/* Progress bar */}
      <div className="px-4">
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-erasmatch-blue transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
};
