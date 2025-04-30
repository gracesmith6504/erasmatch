
import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

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
  const [name, setName] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await onUpdateProfile({ name });
      if (success) {
        onNext();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={5}
      showBackButton={false}
      title="Welcome!"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">What's your first name?</h1>
          <p className="text-gray-500">
            This helps other students identify you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            className="text-center text-xl h-12"
            autoFocus
          />

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full py-6"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-500"
            >
              Skip this question
            </Button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
};
