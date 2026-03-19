import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Calendar } from "lucide-react";
import UniversityAutocomplete from "@/components/UniversityAutocomplete";
import { cn } from "@/lib/utils";
import { SEMESTER_OPTIONS } from "@/components/profile/constants";

type ExchangeDetailsStepProps = {
  initialUniversity: string;
  initialSemester: string | null;
  onNext: () => void;
  onBack: () => void;
  onUpdateProfile: (data: any) => Promise<boolean>;
};

export const ExchangeDetailsStep = ({
  initialUniversity,
  initialSemester,
  onNext,
  onBack,
  onUpdateProfile,
}: ExchangeDetailsStepProps) => {
  const [homeUniversity, setHomeUniversity] = useState(initialUniversity);
  const [semester, setSemester] = useState(initialSemester || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await onUpdateProfile({
        home_university: homeUniversity.trim() || null,
        semester: semester || null,
      });
      if (success) onNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = homeUniversity.trim().length > 0;

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={4}
      onBack={onBack}
    >
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-secondary rounded-full w-14 h-14 flex items-center justify-center">
              <Home className="h-7 w-7 text-accent" />
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold mb-2 text-foreground">
            About your exchange
          </h1>
          <p className="text-sm text-muted-foreground">
            This helps us match you with students on the same timeline.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Home University */}
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-1.5 ml-0.5 flex items-center gap-1">
              <Home className="h-3 w-3" />
              Home university
            </p>
            <UniversityAutocomplete
              value={homeUniversity}
              onChange={setHomeUniversity}
              label=""
              required={false}
              prioritizeIrish={true}
            />
          </div>

          {/* Semester */}
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-3">
            <p className="text-xs font-medium text-muted-foreground ml-0.5 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Exchange semester
              <span className="text-muted-foreground/60">(optional)</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SEMESTER_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSemester(prev => prev === option ? "" : option)}
                  className={cn(
                    "p-3 rounded-xl border-2 text-xs font-medium transition-all duration-200",
                    semester === option
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-accent/50"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                await onUpdateProfile({ home_university: null, semester: null });
                onNext();
              }}
              className="text-muted-foreground"
            >
              I'll add this later
            </Button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
};
