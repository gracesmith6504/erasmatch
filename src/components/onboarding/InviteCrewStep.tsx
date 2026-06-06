import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { InviteCrewBody } from "@/components/share/InviteCrewSheet";

interface InviteCrewStepProps {
  homeUniversity: string | null;
  city: string | null;
  refCode: string | null;
  onComplete: () => void;
}

export const InviteCrewStep = ({ homeUniversity, city, refCode, onComplete }: InviteCrewStepProps) => {
  const [sharedAny, setSharedAny] = useState(false);

  useEffect(() => {
    window.posthog?.capture("invite_step_viewed", {
      has_university: !!homeUniversity,
      has_city: !!city,
      has_ref_code: !!refCode,
    });
  }, [homeUniversity, city, refCode]);

  const handleSkip = () => {
    window.posthog?.capture("invite_step_skipped", { shared_any: sharedAny });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-y-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-5 px-6 text-center max-w-md w-full"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Bring your crew
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Your Erasmus is better with people you know. Invite anyone going abroad.
          </p>
        </div>

        <InviteCrewBody
          homeUniversity={homeUniversity}
          city={city}
          refCode={refCode}
          surface="onboarding"
          onShared={() => setSharedAny(true)}
        />

        <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
          {sharedAny ? "Done — continue" : "Skip for now"}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
};
