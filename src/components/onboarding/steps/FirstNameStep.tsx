
import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, User } from "lucide-react";

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

  const handleSkip = async () => {
    await onUpdateProfile({ name: null });
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
          <div className="flex justify-center mb-5">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
              <User className="h-8 w-8 text-erasmatch-blue" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-erasmatch-blue to-erasmatch-green bg-clip-text text-transparent">
            What's your first name?
          </h1>
          <p className="text-gray-500 mb-6">
            This is how it'll appear on your profile. <br />
            <span className="text-sm text-gray-400">You can change it later.</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            className="text-center text-xl h-14 shadow-sm border-gray-200 rounded-xl"
            autoFocus
          />

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full py-6 bg-gradient-to-r from-erasmatch-blue to-erasmatch-green hover:opacity-90"
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
