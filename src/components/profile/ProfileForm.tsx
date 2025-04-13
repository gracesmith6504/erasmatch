
import { Button } from "@/components/ui/button";
import { ProfileFormFields } from "./ProfileFormFields";
import { useProfileForm } from "./useProfileForm";
import { Loader2 } from "lucide-react";

export function ProfileForm() {
  const { loading, handleSubmit } = useProfileForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProfileFormFields />

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="min-w-[120px]">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Profile"
          )}
        </Button>
      </div>
    </form>
  );
}
