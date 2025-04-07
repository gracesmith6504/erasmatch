
import { Button } from "@/components/ui/button";
import { ProfileFormFields } from "./ProfileFormFields";
import { useProfileForm } from "./useProfileForm";

export function ProfileForm() {
  const { loading, handleSubmit } = useProfileForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProfileFormFields />

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
