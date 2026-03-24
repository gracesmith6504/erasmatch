import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FirstNameStep } from "./steps/FirstNameStep";
import { DestinationUniversityStep } from "./steps/DestinationUniversityStep";
import { ExchangeDetailsStep } from "./steps/ExchangeDetailsStep";
import { InterestsStep } from "./steps/InterestsStep";
import { PhotoStep } from "./steps/PhotoStep";
import { CompletionCelebration } from "./CompletionCelebration";
import { toast } from "sonner";
import { generateUniqueRefCode } from "@/utils/refCodeGenerator";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { currentUserProfile, handleProfileUpdate } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const totalSteps = 4;

  useEffect(() => {
    if (currentUserProfile?.onboarding_complete) {
      navigate("/students");
    }
  }, [currentUserProfile, navigate]);

  const handleUpdateProfile = async (data: any) => {
    try {
      await handleProfileUpdate({ ...data });
      return true;
    } catch (error: any) {
      toast.error("Failed to update profile: " + error.message);
      return false;
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      const refCode = await generateUniqueRefCode(currentUserProfile?.name || "");

      await handleProfileUpdate({
        onboarding_complete: true,
        ref_code: refCode,
      });

      sessionStorage.setItem("justCompletedOnboarding", "true");
      localStorage.removeItem("welcomeBannerDismissed");

      if (currentUserProfile?.city) {
        sessionStorage.setItem("userCity", currentUserProfile.city);
      }

      sessionStorage.removeItem("hasVisitedGroups");
      setShowCelebration(true);
    } catch (error: any) {
      toast.error("Failed to complete onboarding: " + error.message);
    }
  };

  const handleCelebrationComplete = useCallback(() => {
    navigate("/students?from=onboarding");
  }, [navigate]);

  const goToNextStep = () => {
    setDirection(1);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCompleteOnboarding();
    }
  };

  const goToPreviousStep = () => {
    setDirection(-1);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (showCelebration) {
    return <CompletionCelebration onComplete={handleCelebrationComplete} />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <FirstNameStep
            initialValue={currentUserProfile?.name || ""}
            onNext={goToNextStep}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 1:
        return (
          <DestinationUniversityStep
            initialValue={currentUserProfile?.university || ""}
            initialCity={currentUserProfile?.city || ""}
            onNext={goToNextStep}
            onUpdateProfile={handleUpdateProfile}
            onBack={goToPreviousStep}
          />
        );
      case 2:
        return (
          <ExchangeDetailsStep
            initialUniversity={currentUserProfile?.home_university || ""}
            initialSemester={currentUserProfile?.semester || ""}
            onNext={goToNextStep}
            onUpdateProfile={handleUpdateProfile}
            onBack={goToPreviousStep}
          />
        );
      case 3:
        return (
          <InterestsStep
            initialValue={currentUserProfile?.personality_tags || []}
            onComplete={handleCompleteOnboarding}
            onUpdateProfile={handleUpdateProfile}
            onBack={goToPreviousStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={currentStep}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  );
};
