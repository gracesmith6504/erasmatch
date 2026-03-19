import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShieldAlert, Ban } from "lucide-react";

interface BlockUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  onBlock: () => void;
  onBlockAndReport: (reason: string) => void;
}

export const BlockUserDialog = ({
  isOpen,
  onOpenChange,
  userName,
  onBlock,
  onBlockAndReport,
}: BlockUserDialogProps) => {
  const [showReport, setShowReport] = useState(false);
  const [reason, setReason] = useState("");

  const handleBlock = () => {
    onBlock();
    resetAndClose();
  };

  const handleBlockAndReport = () => {
    onBlockAndReport(reason);
    resetAndClose();
  };

  const resetAndClose = () => {
    setShowReport(false);
    setReason("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {showReport ? "Block & Report" : "Block User"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {showReport
              ? `Tell us why you're reporting ${userName}. This will also block them.`
              : `Are you sure you want to block ${userName}? They won't be able to message you, see your profile, or appear in your student list. This action is silent.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {showReport && (
          <Textarea
            placeholder="Describe the issue (optional)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[80px]"
          />
        )}

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={() => { setShowReport(false); setReason(""); }}>
            Cancel
          </AlertDialogCancel>
          {showReport ? (
            <Button
              variant="destructive"
              onClick={handleBlockAndReport}
              className="flex items-center gap-2"
            >
              <ShieldAlert className="h-4 w-4" />
              Block & Report
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setShowReport(true)}
                className="flex items-center gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <ShieldAlert className="h-4 w-4" />
                Block & Report
              </Button>
              <Button
                variant="destructive"
                onClick={handleBlock}
                className="flex items-center gap-2"
              >
                <Ban className="h-4 w-4" />
                Block
              </Button>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
