
import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [city, setCity] = useState<string>("");
  const [cityAutoFilled, setCityAutoFilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = async (value: string) => {
    setUniversity(value);
    setCityAutoFilled(false);

    try {
      const { data, error } = await supabase
        .from("universities")
        .select("city")
        .eq("name", value)
        .single();

      if (!error && data?.city) {
        setCity(data.city);
        setCityAutoFilled(true);
      } else {
        // Don't clear city if user already typed something
        if (cityAutoFilled) {
          setCity("");
          setCityAutoFilled(false);
        }
      }
    } catch (err) {
      console.error("Lookup error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await onUpdateProfile({ 
        university, 
        city: city.trim() || null 
      });
      if (success) {
        onNext();
      }
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="w-full flex flex-col gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <UniversityAutocomplete
              value={university}
              onChange={handleChange}
              label=""
              required={false}
            />

            {/* Editable city field - always visible when university is set */}
            {university && (
              <div className="flex items-center gap-2 animate-fade-in">
                <MapPin className="h-4 w-4 text-erasmatch-green shrink-0" />
                <Input
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setCityAutoFilled(false);
                  }}
                  placeholder="Which city? (e.g. Barcelona, Milan)"
                  className="h-9 text-sm border-dashed"
                />
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
