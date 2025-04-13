
import { Button } from "@/components/ui/button";
import { ProfileFormFields } from "./ProfileFormFields";
import { useProfileForm } from "./useProfileForm";
import { Loader2 } from "lucide-react";

export function ProfileForm() {
  const { loading, isSaving, handleSubmit, fetchingProfile } = useProfileForm();

  if (fetchingProfile) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-erasmatch-purple" />
        <span className="ml-2 text-gray-600">Loading your profile...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProfileFormFields />

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading || isSaving}
          className="relative"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
