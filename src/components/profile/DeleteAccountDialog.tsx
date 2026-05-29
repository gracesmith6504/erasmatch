import { FunctionsHttpError } from "@supabase/supabase-js";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DeleteAccountDialogProps {
  userId: string | null;
}

const clearLocalAuthState = () => {
  localStorage.removeItem("userId");
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
      localStorage.removeItem(key);
    }
  });
};

export const DeleteAccountDialog = ({ userId }: DeleteAccountDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!userId) {
      toast.error("Unable to delete account. User ID not found.");
      return;
    }

    try {
      setIsDeleting(true);
      sessionStorage.setItem("accountDeletionInProgress", "true");

      const { error } = await supabase.functions.invoke("delete-account", {
        body: { userId },
      });

      if (error) {
        let message = error.message || "Failed to delete account";

        if (error instanceof FunctionsHttpError) {
          const response = await error.context.json().catch(() => null);
          if (response?.error) {
            message = response.error;
          }
        }

        throw new Error(message);
      }

      await supabase.auth.signOut({ scope: "local" }).catch((signOutError) => {
        console.error("Error clearing local session:", signOutError);
      });

      clearLocalAuthState();
      sessionStorage.removeItem("accountDeletionInProgress");
      setIsOpen(false);
      window.location.replace("/auth?mode=signup");
    } catch (error: any) {
      sessionStorage.removeItem("accountDeletionInProgress");
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
