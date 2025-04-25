
import { Button } from "@/components/ui/button";
import { ProfileFormFields } from "./ProfileFormFields";
import { Loader2 } from "lucide-react";
import { useProfileContext } from "./ProfileContext";

export function ProfileForm() {
  const { loading, handleSubmit } = useProfileContext();

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <ProfileFormFields />

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading} 
          variant="gradient"
          size="lg"
          className="min-w-[140px] shadow-button hover:shadow-lg"
        >
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
