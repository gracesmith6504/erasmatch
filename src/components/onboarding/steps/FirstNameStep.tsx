import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type FirstNameStepProps = {
  initialValue: string;
  onNext: () => void;
  onUpdateProfile: (data: any) => Promise<boolean>;
};

export const FirstNameStep = ({
  initialValue,
  onNext,
  onUpdateProfile,
}: FirstNameStepProps) => {
  const isMobile = useIsMobile();
  const [name, setName] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await onUpdateProfile({ name });
      if (success) onNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={6}
      showBackButton={false}
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <span className="text-5xl" role="img" aria-label="wave">👋</span>
          </div>
          <h1 className="text-2xl font-display font-bold mb-2 text-foreground">
            Let's get to know you
          </h1>
          <p className="text-muted-foreground mb-1">
            What should we call you?
          </p>
          <p className="text-sm text-muted-foreground/70">
            This is how you'll appear to other students.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            className="text-center text-xl h-14 shadow-sm border-border rounded-xl bg-card"
            autoFocus={!isMobile}
          />

          <Button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </OnboardingLayout>
  );
};
