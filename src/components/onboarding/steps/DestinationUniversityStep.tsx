import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import UniversityAutocomplete from "@/components/UniversityAutocomplete";
import { supabase } from "@/integrations/supabase/client";

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
  const [city, setCity] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = async (value: string) => {
    setUniversity(value);

    try {
      const { data, error } = await supabase
        .from("universities")
        .select("city")
        .eq("name", value)
        .single();

      if (error) {
        console.error("Failed to fetch city:", error);
        setCity(null);
      } else {
        setCity(data?.city || null);
      }
    } catch (err) {
      console.error("Lookup error:", err);
      setCity(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
          <div className="w-full flex flex-col gap-2">
            <UniversityAutocomplete
              value={university}
              onChange={handleChange}
              label=""
              required={false}
            />

            {/* City label if university is selected */}
            {university && (
              <div className="flex items-center text-sm text-gray-600 px-1">
                <MapPin className="h-4 w-4 mr-1 text-erasmatch-green shrink-0" />
                <span className="truncate">
                  {city ? city : "City not available for this university"}
                </span>
              </div>
            )}

            {/* 🔁 Always-visible manual entry link */}
            <div className="text-center mt-1">
              <p
                onClick={() => setUniversity("")}
                className="text-xs text-gray-500 underline cursor-pointer"
              >
                Can’t find your university? Enter it manually
              </p>
            </div>
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
