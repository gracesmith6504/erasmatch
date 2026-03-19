
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
          <div className="flex justify-center mb-5">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
              <Home className="h-8 w-8 text-erasmatch-blue" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-3 text-foreground">
            Where are you coming from?
          </h1>
          
          <p className="text-gray-500 mb-1">
            Tell us your home university — it helps us connect you with others from the same background.
          </p>
          
          <p className="text-sm text-gray-400">
            You'll see students leaving from the same place. You can always update this later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <UniversityAutocomplete
              value={homeUniversity}
              onChange={handleChange}
              label=""
              required={false}
              prioritizeIrish={true}
            />
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !homeUniversity.trim()}
              className="w-full py-6 bg-gradient-to-r from-erasmatch-blue to-erasmatch-green hover:opacity-90"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
};
