
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { FirstNameStep } from "./steps/FirstNameStep";
import { DestinationUniversityStep } from "./steps/DestinationUniversityStep";
import { HomeUniversityStep } from "./steps/HomeUniversityStep";
import { CourseStep } from "./steps/CourseStep";
import { InterestsStep } from "./steps/InterestsStep";
import { toast } from "sonner";

export const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { currentUserProfile, handleProfileUpdate } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;

  // Handle case where user is already onboarded
  useEffect(() => {
    if (currentUserProfile?.onboarding_complete) {
      navigate("/students");
    }
  }, [currentUserProfile, navigate]);

  const handleUpdateProfile = async (data: any) => {
    try {
      await handleProfileUpdate({
        ...data,
      });
      return true;
    } catch (error: any) {
      toast.error("Failed to update profile: " + error.message);
      return false;
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      await handleProfileUpdate({
        onboarding_complete: true,
      });
      toast.success("Welcome to ErasMatch!");
      navigate("/students");
    } catch (error: any) {
      toast.error("Failed to complete onboarding: " + error.message);
    }
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCompleteOnboarding();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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
          <CourseStep
            initialValue={currentUserProfile?.course || ""}
            onNext={goToNextStep}
            onUpdateProfile={handleUpdateProfile}
            onBack={goToPreviousStep}
          />
        );
      case 4:
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

  return <>{renderStep()}</>;
};
