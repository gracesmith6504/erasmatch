import { useState } from "react";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Plane } from "lucide-react";
import { Input } from "@/components/ui/input";
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-1.5 ml-0.5 flex items-center gap-1">
              <Plane className="h-3 w-3" />
              When do you arrive?
            </p>
            <Input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-1.5 ml-0.5 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              When do you leave?
            </p>
            <Input
              type="date"
              value={departureDate}
              min={arrivalDate || undefined}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="bg-background"
            />
          </div>

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
