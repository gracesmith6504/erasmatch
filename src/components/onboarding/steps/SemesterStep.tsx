
import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEMESTER_OPTIONS } from "@/components/profile/constants";

type SemesterStepProps = {
  initialValue: string | null;
  onNext: () => void;
  onBack: () => void;
  onUpdateProfile: (data: any) => Promise<boolean>;
};

export const SemesterStep = ({
  initialValue,
  onNext,
  onBack,
  onUpdateProfile,
}: SemesterStepProps) => {
  const [semester, setSemester] = useState(initialValue || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!semester) return;
    setIsSubmitting(true);
    try {
      const success = await onUpdateProfile({ semester });
      if (success) onNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={5}
      onBack={onBack}
      title="Your Semester"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-erasmatch-blue" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-erasmatch-blue to-erasmatch-green bg-clip-text text-transparent">
            When's your exchange?
          </h1>
          <p className="text-muted-foreground mb-1">
            Select the semester you're going on Erasmus.
          </p>
          <p className="text-sm text-muted-foreground/70">
            This helps match you with students in the same period.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {SEMESTER_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSemester(option)}
                className={cn(
                  "p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200",
                  semester === option
                    ? "border-erasmatch-blue bg-erasmatch-blue/10 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-erasmatch-blue/50"
                )}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !semester}
              className="w-full py-6 bg-gradient-to-r from-erasmatch-blue to-erasmatch-green hover:opacity-90"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onNext}
              className="text-muted-foreground"
            >
              Skip this question
            </Button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
};
