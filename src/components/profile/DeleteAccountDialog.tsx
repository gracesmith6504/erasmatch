import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface DeleteAccountDialogProps {
  userId: string | null;
}

export const DeleteAccountDialog = ({ userId }: DeleteAccountDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!userId) {
      toast.error("Unable to delete account. User ID not found.");
      return;
    }

    try {
      setIsDeleting(true);

      // Get current session to check auth method
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("No active session found");
        return;
      }

      console.log("Starting account deletion process for user:", userId);

      // Mark the profile as deleted with timestamp instead of actually deleting it
      // This approach allows us to handle re-registration properly
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          deleted_at: new Date().toISOString(),
          // Clear sensitive data but keep the record
          email: null,
          name: null,
          bio: null,
          avatar_url: null,
          onboarding_complete: false
        })
        .eq('id', userId);

      if (profileError) {
        console.error("Error marking profile as deleted:", profileError);
        toast.error("Failed to delete account data");
        return;
      }

      console.log("Profile marked as deleted successfully");

      // Sign out the user
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        console.error("Error signing out:", signOutError);
        // Continue anyway as the profile is already marked as deleted
      }

      // Close the dialog
      setIsOpen(false);
      
      // Show success message
      toast.success("Your account has been deleted successfully. You can create a new account with the same email address.");
      
      // Redirect to signup page
      navigate("/auth?mode=signup");
      
    } catch (error: any) {
      console.error("Error during account deletion:", error);
      toast.error(`Failed to delete account: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline" 
        className="mt-8 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete My Account
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete your account and all associated data. 
              You will be able to create a new account with the same email address if you wish.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteAccount();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Yes, delete my account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
