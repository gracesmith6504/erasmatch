
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

      // Delete the user's profile data first
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error("Error deleting profile:", profileError);
        // Continue with user deletion even if profile deletion fails
      }

      // Use the client-side user deletion method that works for all auth providers
      const { error: deleteError } = await supabase.rpc('delete_user');
      
      if (deleteError) {
        console.error("User deletion failed:", deleteError);
        
        // Fallback: Mark profile as deleted but user can't re-register with same email
        await supabase
          .from('profiles')
          .upsert({
            id: userId,
            name: 'Deleted User',
            avatar_url: null,
            bio: '',
            deleted_at: new Date().toISOString(),
            personality_tags: [],
          });
        
        toast.success("Your account has been deactivated. Note: You may not be able to create a new account with the same email address.");
      } else {
        toast.success("Your account has been permanently deleted. You can now create a new account with the same email if desired.");
      }

      // Sign the user out
      await supabase.auth.signOut();
      
      // Close the dialog
      setIsOpen(false);
      
      // Redirect to login page
      navigate("/auth?mode=login");
      
    } catch (error: any) {
      console.error("Error deleting account:", error);
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
