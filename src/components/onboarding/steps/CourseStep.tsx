
import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, BookOpen } from "lucide-react";

type CourseStepProps = {
  initialValue: string | null;
  onNext: () => void;
  onBack: () => void;
  onUpdateProfile: (data: any) => Promise<boolean>;
};

export const CourseStep = ({
  initialValue,
  onNext,
  onBack,
  onUpdateProfile,
}: CourseStepProps) => {
  const [course, setCourse] = useState(initialValue || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourse(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await onUpdateProfile({ course });
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
      currentStep={4}
      totalSteps={5}
      onBack={onBack}
      title="Your Studies"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-erasmatch-blue" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-erasmatch-blue to-erasmatch-green bg-clip-text text-transparent">
            What are you studying?
          </h1>
          <p className="text-gray-500">
            Your course or field of study
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full flex flex-col gap-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Input
              type="text"
              value={course}
              onChange={handleChange}
              placeholder="Your course name"
              className="text-center text-xl h-12 border-gray-200 focus:border-erasmatch-blue focus:ring-erasmatch-blue/20"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !course.trim()}
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
