import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Plane } from "lucide-react";
import { DateField } from "@/components/ui/DateField";
import { formatSemester } from "@/lib/semesterParsing";

type ExchangeDetailsStepProps = {
  initialSemester: string | null;
  initialArrivalDate: string | null;
  onNext: () => void;
  onBack: () => void;
  onUpdateProfile: (data: any) => Promise<boolean>;
};

export const ExchangeDetailsStep = ({
  initialArrivalDate,
  onNext,
  onBack,
  onUpdateProfile,
}: ExchangeDetailsStepProps) => {
  const [arrivalDate, setArrivalDate] = useState(initialArrivalDate || "");
  const [departureDate, setDepartureDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const datesValid =
    arrivalDate.length > 0 &&
    departureDate.length > 0 &&
    new Date(departureDate) > new Date(arrivalDate);

  const previewText = datesValid ? formatSemester(arrivalDate, departureDate) : "";

  const handleArrivalChange = (iso: string | null) => {
    const next = iso || "";
    setArrivalDate(next);
    // Clear departure if it's now invalid
    if (departureDate && next && new Date(departureDate) <= new Date(next)) {
      setDepartureDate("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!datesValid) return;
    setIsSubmitting(true);
    try {
      const success = await onUpdateProfile({
        arrival_date: arrivalDate,
        semester: formatSemester(arrivalDate, departureDate),
      });
      if (success) onNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout currentStep={4} totalSteps={6} onBack={onBack}>
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-secondary rounded-full w-14 h-14 flex items-center justify-center">
              <Calendar className="h-7 w-7 text-accent" />
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold mb-2 text-foreground">
            About your exchange
          </h1>
          <p className="text-sm text-muted-foreground">
            This helps us match you with students on the same timeline.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <DateField
            value={arrivalDate || null}
            onChange={handleArrivalChange}
            label="When do you arrive?"
            icon={Plane}
            placeholder="Pick your arrival date"
          />

          <DateField
            value={departureDate || null}
            onChange={(iso) => setDepartureDate(iso || "")}
            label="When do you leave?"
            icon={Calendar}
            placeholder="Pick your departure date"
            minDate={arrivalDate ? new Date(arrivalDate) : undefined}
            disabled={!arrivalDate}
          />

          {previewText && (
            <div className="bg-secondary/50 rounded-xl px-4 py-3 text-sm text-foreground text-center animate-fade-in">
              Got it, you'll be there{" "}
              <span className="font-semibold">{previewText}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !datesValid}
            className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </OnboardingLayout>
  );
};
