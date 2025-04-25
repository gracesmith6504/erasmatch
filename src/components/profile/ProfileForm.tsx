
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
          className="min-w-[140px] bg-gradient-to-r from-erasmatch-blue to-erasmatch-purple hover:from-erasmatch-purple hover:to-erasmatch-blue transition-all duration-300"
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
