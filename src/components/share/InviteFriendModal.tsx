import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Copy, Check } from "lucide-react";

interface InviteFriendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refCode: string;
}

const InviteFriendModal: React.FC<InviteFriendModalProps> = ({
  open,
  onOpenChange,
  refCode,
}) => {
  const [copied, setCopied] = useState(false);

  const referralUrl = `https://erasmatch.lovable.app/?ref=${refCode}`;
  const whatsappUrl = `https://wa.me/?text=hey%20are%20you%20doing%20erasmus%3F%20i%20found%20this%20site%20where%20you%20can%20find%20people%20going%20to%20the%20same%20city%20before%20you%20arrive%20%E2%80%94%20use%20my%20link%20and%20you%27ll%20see%20my%20profile%20${encodeURIComponent(referralUrl)}`;

  const dismiss = () => {
    localStorage.setItem("invitePromptSeen", "true");
    onOpenChange(false);
  };

  const handleWhatsApp = () => {
    localStorage.setItem("invitePromptSeen", "true");
    window.open(whatsappUrl, "_blank");
    setTimeout(() => onOpenChange(false), 500);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralUrl);
    localStorage.setItem("invitePromptSeen", "true");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={dismiss}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Know anyone else doing Erasmus?
          </DialogTitle>
        </DialogHeader>
        <p className="text-center text-sm text-muted-foreground">
          Send them your link — they'll see your profile first when they sign up.
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <Button
            onClick={handleWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Share on WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={handleCopy}
            className="w-full"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy link
              </>
            )}
          </Button>
        </div>
        <button
          onClick={dismiss}
          className="mx-auto mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          maybe later
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default InviteFriendModal;
