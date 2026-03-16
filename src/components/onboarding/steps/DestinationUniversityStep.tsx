
import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, School, MapPin } from "lucide-react";
import UniversityAutocomplete from "@/components/UniversityAutocomplete";
import { CityAutocomplete } from "@/components/CityAutocomplete";
import { supabase } from "@/integrations/supabase/client";
import { autoAddUniversity } from "@/components/university/useAutoAddUniversity";

type DestinationUniversityStepProps = {
  initialValue: string;
  initialCity?: string;
  onNext: () => void;
  onBack: () => void;
  onUpdateProfile: (data: any) => Promise<boolean>;
};

export const DestinationUniversityStep = ({
  initialValue,
  initialCity = "",
  onNext,
  onBack,
  onUpdateProfile,
}: DestinationUniversityStepProps) => {
  const [university, setUniversity] = useState(initialValue);
  const [city, setCity] = useState<string>(initialCity);
  const [cityAutoFilled, setCityAutoFilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"university" | "city">("university");

  const handleUniversityChange = async (value: string, isFromApi?: boolean) => {
    setUniversity(value);

    if (isFromApi) {
      // From Hipo API — auto-added to DB but no city, prompt user
      setCity("");
      setCityAutoFilled(false);
      return;
    }

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
      } else if (cityAutoFilled) {
        setCity("");
        setCityAutoFilled(false);
      }
    } catch (err) {
      console.error("Lookup error:", err);
    }
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    setCityAutoFilled(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedUni = university.trim();
    const trimmedCity = city.trim();
    
    if (!trimmedUni && !trimmedCity) return;
    
    setIsSubmitting(true);

    try {
      const success = await onUpdateProfile({ 
        university: trimmedUni || null, 
        city: trimmedCity || null 
      });
      if (success) {
        onNext();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = university.trim().length > 0 || city.trim().length > 0;

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={5}
      onBack={onBack}
      title="Your Destination"
    >
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-accent rounded-full w-14 h-14 flex items-center justify-center">
              {mode === "university" ? (
                <School className="h-7 w-7 text-primary" />
              ) : (
                <MapPin className="h-7 w-7 text-primary" />
              )}
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-erasmatch-blue to-erasmatch-green bg-clip-text text-transparent">
            Where are you headed?
          </h1>
          
          <p className="text-sm text-muted-foreground">
            We'll connect you with students in the same place.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 p-1 bg-secondary rounded-full">
          <button
            type="button"
            onClick={() => setMode("university")}
            className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all ${
              mode === "university"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            I know my university
          </button>
          <button
            type="button"
            onClick={() => setMode("city")}
            className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all ${
              mode === "city"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            I know my city
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full flex flex-col gap-3 bg-card rounded-xl p-4 shadow-sm border border-border">
            {mode === "university" ? (
              <>
                {/* University-first mode */}
                <UniversityAutocomplete
                  value={university}
                  onChange={handleUniversityChange}
                  label=""
                  required={false}
                />

                {/* City appears after university is selected, or always if user wants to add it */}
                {(university || city) && (
                  <div className="animate-fade-in">
                    <p className="text-xs text-muted-foreground mb-1.5 ml-0.5">
                      {cityAutoFilled ? "City (auto-detected)" : "Which city?"}
                    </p>
                    <CityAutocomplete
                      value={city}
                      onChange={handleCityChange}
                      placeholder="Select or type your city"
                      compact
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                {/* City-first mode */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 ml-0.5">
                    Destination city
                  </p>
                  <CityAutocomplete
                    value={city}
                    onChange={handleCityChange}
                    placeholder="Where are you going? (e.g. Barcelona)"
                  />
                </div>

                {/* University appears after city */}
                {city && (
                  <div className="animate-fade-in">
                    <p className="text-xs text-muted-foreground mb-1.5 ml-0.5">
                      University (optional — you can add this later)
                    </p>
                    <UniversityAutocomplete
                      value={university}
                      onChange={handleUniversityChange}
                      label=""
                      required={false}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !canSubmit}
            className="w-full py-6 bg-gradient-to-r from-erasmatch-blue to-erasmatch-green hover:opacity-90"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </OnboardingLayout>
  );
};
