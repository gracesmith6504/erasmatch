
import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, School } from "lucide-react";
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
      // Query the universities table to get city information
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
      // Save both university and city to the profile
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
          <div className="flex justify-center mb-5">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
              <School className="h-8 w-8 text-erasmatch-green" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-erasmatch-blue to-erasmatch-green bg-clip-text text-transparent">
            Headed somewhere exciting?
          </h1>
          
          <p className="text-gray-500 mb-1">
            Choose your destination university so we can add you to the right group chats.
          </p>
          
          <p className="text-sm text-gray-400">
            You'll instantly see others going to the same city — and yes, you can change it later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full flex flex-col gap-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <UniversityAutocomplete
              value={university}
              onChange={handleChange}
              label=""
              required={false}
            />

            {/* City label if university is selected */}
            {university && (
              <div className="flex items-center text-sm text-gray-600 px-1 mt-1 animate-fade-in">
                <MapPin className="h-4 w-4 mr-1 text-erasmatch-green shrink-0" />
                <span className="truncate">
                  {city ? city : "City not available for this university"}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !university.trim()}
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
