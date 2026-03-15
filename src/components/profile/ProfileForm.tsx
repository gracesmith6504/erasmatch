
import { Button } from "@/components/ui/button";
import { ProfileFormFields } from "./ProfileFormFields";
import { Loader2, Save } from "lucide-react";
import { useProfileContext } from "./ProfileContext";

export function ProfileForm() {
  const { loading, handleSubmit } = useProfileContext();

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ProfileFormFields />

      <div className="flex justify-center pt-4">
        <Button type="submit" disabled={loading} className="min-w-[180px] h-12 text-base font-semibold gap-2 rounded-full shadow-md">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
