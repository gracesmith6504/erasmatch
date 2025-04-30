
import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import UniversityAutocomplete from "@/components/UniversityAutocomplete";
import { useUniversitySearch } from "@/components/university/useUniversitySearch";

type DestinationUniversityStepProps = {
  initialValue: string;
  onNext: () => void;
  onBack: () => void;
  onUpdateProfile: (data: any) => Promise<boolean>;
};

export const DestinationUniversityStep = ({
  initialValue,
  onNext,
  onBack,
  onUpdateProfile,
}: DestinationUniversityStepProps) => {
  const [university, setUniversity] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { universities } = useUniversitySearch(); // ✅ Get university list with city info

  const handleChange = (value: string) => {
    setUniversity(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selected = universities.find((u) => u.name === university);
    const city = selected?.city || null;
    
    try {
      const success = await onUpdateProfile({ university, city });
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
      currentStep={2}
      totalSteps={5}
      onBack={onBack}
      title="Your Exchange"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Where are you going?</h1>
          <p className="text-gray-500">
            Your destination university for exchange
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full">
            <UniversityAutocomplete
              value={university}
              onChange={handleChange}
              label=""
              required={false}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !university.trim()}
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
