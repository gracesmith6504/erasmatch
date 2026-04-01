import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";
import UniversityAutocomplete from "@/components/UniversityAutocomplete";

type HomeUniversityStepProps = {
  initialValue: string;
  onNext: () => void;
  onBack: () => void;
  onUpdateProfile: (data: any) => Promise<boolean>;
};

export const HomeUniversityStep = ({
  initialValue,
  onNext,
  onBack,
  onUpdateProfile,
}: HomeUniversityStepProps) => {
  const [homeUniversity, setHomeUniversity] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await onUpdateProfile({ home_university: homeUniversity.trim() || null });
      if (success) onNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={6}
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
            Where are you coming from?
          </h1>
          <p className="text-sm text-muted-foreground">
            This helps us connect you with students from the same university.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <UniversityAutocomplete
              value={homeUniversity}
              onChange={setHomeUniversity}
              label=""
              required={false}
              prioritizeIrish={true}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !homeUniversity.trim()}
              className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                await onUpdateProfile({ home_university: null });
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
