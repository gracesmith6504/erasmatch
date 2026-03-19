import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { PERSONALITY_TAG_GROUPS } from "@/components/profile/constants";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";

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
      });
      if (success) onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={4}
      onBack={onBack}
    >
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <span className="text-5xl" role="img" aria-label="sparkles">✨</span>
          </div>
          <h1 className="text-2xl font-display font-bold mb-2 bg-gradient-to-r from-erasmatch-blue to-erasmatch-green bg-clip-text text-transparent">
            What are you into?
          </h1>
          <p className="text-sm text-muted-foreground">
            Pick at least 3 to get better matches with like-minded students.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-card rounded-xl shadow-sm border border-border p-4 space-y-4 max-h-[45vh] overflow-y-auto">
            {PERSONALITY_TAG_GROUPS.map((group) => (
              <div key={group.name}>
                <p className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider mb-2">
                  {group.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.value);
                    return (
                      <Badge
                        key={tag.value}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-all px-3 py-1.5 text-sm ${
                          isSelected
                            ? "bg-accent text-accent-foreground border-accent shadow-sm"
                            : "bg-card text-muted-foreground border-border hover:border-accent/50 hover:text-foreground"
                        }`}
                        onClick={() => toggleTag(tag.value)}
                      >
                        {isSelected && <Check className="h-3 w-3 mr-1" />}
                        {tag.icon} {tag.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {selectedTags.length > 0 && (
            <p className="text-xs text-center text-muted-foreground/70">
              {selectedTags.length} selected{selectedTags.length < 3 ? ` — pick ${3 - selectedTags.length} more for best results` : ""}
            </p>
          )}

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full py-6 bg-gradient-to-r from-erasmatch-blue to-erasmatch-green hover:opacity-90 text-white"
              disabled={isSubmitting}
            >
              Complete Profile
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
};
