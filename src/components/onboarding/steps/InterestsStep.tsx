
import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { PERSONALITY_TAGS } from "@/components/profile/constants";
import { Badge } from "@/components/ui/badge";
import { Check, Heart } from "lucide-react";

type InterestsStepProps = {
  initialValue: string[];
  onComplete: () => void;
  onBack: () => void;
  onUpdateProfile: (data: any) => Promise<boolean>;
};

export const InterestsStep = ({
  initialValue,
  onComplete,
  onBack,
  onUpdateProfile,
}: InterestsStepProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialValue || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate tag color based on tag name for consistent coloring
  const getTagColor = (tag: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-yellow-100 text-yellow-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-orange-100 text-orange-800",
      "bg-teal-100 text-teal-800",
    ];
    
    // Use the tag string to pick a consistent color
    const index = tag.length % colors.length;
    return colors[index];
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await onUpdateProfile({ 
        personality_tags: selectedTags,
        onboarding_complete: true
      });
      if (success) {
        onComplete();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={5}
      totalSteps={5}
      onBack={onBack}
      title="Final Step"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center">
              <Heart className="h-8 w-8 text-pink-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-erasmatch-blue to-erasmatch-green bg-clip-text text-transparent">
            What describes you?
          </h1>
          <p className="text-gray-500 mb-4">
            Select your interests to connect with like-minded students
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap gap-2 justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            {PERSONALITY_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag.value);
              return (
                <Badge
                  key={tag.value}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all flex items-center ${
                    isSelected ? getTagColor(tag.value) : "hover:bg-gray-100"
                  } px-4 py-2 text-base animate-fade-in`}
                  onClick={() => toggleTag(tag.value)}
                >
                  {isSelected && <Check className="h-3 w-3 mr-1" />}
                  {tag.icon} {tag.label}
                </Badge>
              );
            })}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full py-6 bg-gradient-to-r from-erasmatch-blue to-erasmatch-green hover:opacity-90"
              disabled={isSubmitting}
            >
              Complete Profile
              <Check className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
};
