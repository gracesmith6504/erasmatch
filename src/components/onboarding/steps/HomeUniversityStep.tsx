
import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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

  const handleChange = (value: string) => {
    setHomeUniversity(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await onUpdateProfile({ home_university: homeUniversity });
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
      currentStep={3}
      totalSteps={5}
      onBack={onBack}
      title="Your Origin"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Where are you from?</h1>
          <p className="text-gray-500">
            Your home university
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full">
            <UniversityAutocomplete
              value={homeUniversity}
              onChange={handleChange}
              label=""
              required={false}
              prioritizeIrish={true}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !homeUniversity.trim()}
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
