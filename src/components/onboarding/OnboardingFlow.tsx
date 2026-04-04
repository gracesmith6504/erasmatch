import { useState, useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FirstNameStep } from "./steps/FirstNameStep";
import { DestinationUniversityStep } from "./steps/DestinationUniversityStep";
import { HomeUniversityStep } from "./steps/HomeUniversityStep";
import { ExchangeDetailsStep } from "./steps/ExchangeDetailsStep";
import { InterestsStep } from "./steps/InterestsStep";
import { PhotoStep } from "./steps/PhotoStep";
import { CompletionCelebration } from "./CompletionCelebration";
import { CityPayoff } from "./CityPayoff";
import { toast } from "sonner";
import { generateUniqueRefCode } from "@/utils/refCodeGenerator";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";


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
  const [currentStep, setCurrentStep] = useState(currentUserProfile?.onboarding_step ?? 0);
  const [direction, setDirection] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCityPayoff, setShowCityPayoff] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(() => (currentUserProfile?.onboarding_step ?? 0) > 0);
  const completingRef = useRef(false);
  const totalSteps = 6;

  useEffect(() => {
    if (showWelcomeBack) {
      const timer = setTimeout(() => setShowWelcomeBack(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showWelcomeBack]);

  useEffect(() => {
    // Only redirect if onboarding was already complete on mount (returning user).
    // Don't redirect during the completion sequence (celebration → city payoff).
    if (currentUserProfile?.onboarding_complete && !completingRef.current && !showCelebration && !showCityPayoff) {
      navigate("/students");
    }
  }, [currentUserProfile, navigate, showCelebration, showCityPayoff]);

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
      window.posthog?.capture("onboarding_step_submitted", {
        step: 5,
        step_name: "photo",
        filled: !!currentUserProfile?.avatar_url,
        skipped: !currentUserProfile?.avatar_url,
      });
      window.posthog?.capture("onboarding_completed", {
        city: currentUserProfile?.city,
        university: currentUserProfile?.university,
        has_avatar: !!currentUserProfile?.avatar_url,
        tags_count: currentUserProfile?.personality_tags?.length || 0,
      });
      completingRef.current = true;
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
    setShowCityPayoff(true);
  }, []);

  const handleCityPayoffComplete = useCallback(() => {
    navigate("/students?from=onboarding");
  }, [navigate]);

  const goToNextStep = () => {
    const stepNames = ["first_name", "destination_university", "home_university", "exchange_details", "interests", "photo"];
    if (currentStep < stepNames.length) {
      const extras: Record<string, unknown> = { step: currentStep, step_name: stepNames[currentStep] };
      switch (currentStep) {
        case 0: extras.filled = !!currentUserProfile?.name?.trim(); break;
        case 1: extras.filled = !!(currentUserProfile?.university && currentUserProfile?.city); break;
        case 2: extras.filled = !!currentUserProfile?.home_university; break;
        case 3: extras.filled = !!currentUserProfile?.semester; extras.had_arrival_date = !!currentUserProfile?.arrival_date; break;
        case 4: extras.tags_selected = currentUserProfile?.personality_tags?.length || 0; extras.skipped = !currentUserProfile?.personality_tags?.length; break;
      }
      window.posthog?.capture("onboarding_step_submitted", extras);
    }

    setDirection(1);
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      handleUpdateProfile({ onboarding_step: nextStep });
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

  if (!currentUserProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (showCityPayoff) {
    return (
      <CityPayoff
        city={currentUserProfile?.city ?? null}
        userId={currentUserProfile?.id ?? ""}
        onComplete={handleCityPayoffComplete}
      />
    );
  }

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
          <HomeUniversityStep
            initialValue={currentUserProfile?.home_university || ""}
            onNext={goToNextStep}
            onUpdateProfile={handleUpdateProfile}
            onBack={goToPreviousStep}
          />
        );
      case 3:
        return (
          <ExchangeDetailsStep
            initialSemester={currentUserProfile?.semester || ""}
            initialArrivalDate={currentUserProfile?.arrival_date || null}
            onNext={goToNextStep}
            onUpdateProfile={handleUpdateProfile}
            onBack={goToPreviousStep}
          />
        );
      case 4:
        return (
          <InterestsStep
            initialValue={currentUserProfile?.personality_tags || []}
            onComplete={goToNextStep}
            onUpdateProfile={handleUpdateProfile}
            onBack={goToPreviousStep}
          />
        );
      case 5:
        return (
          <PhotoStep
            onNext={handleCompleteOnboarding}
            onUpdateProfile={handleUpdateProfile}
            onBack={goToPreviousStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showWelcomeBack && (
          <motion.div
            key="welcome-back"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground text-center py-2.5 text-sm font-medium shadow-md"
          >
            Welcome back! Let's pick up where you left off 👋
          </motion.div>
        )}
      </AnimatePresence>
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
    </div>
  );
};
