import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSendMessage } from "@/hooks/useSendMessage";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import InviteFriendModal from "@/components/share/InviteFriendModal";
import { useIsMobile } from "@/hooks/use-mobile";


const MAX_CHARS = 100;

interface ConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentName: string;
  sharedCity?: string | null;
  sharedUniversity?: string | null;
  initialNote?: string;
}

const ConnectModal: React.FC<ConnectModalProps> = ({
  open,
  onOpenChange,
  studentId,
  studentName,
  sharedCity,
  sharedUniversity,
  initialNote,
}) => {
  const [note, setNote] = useState(initialNote ?? "");
  const [sending, setSending] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const sendMessage = useSendMessage();
  const { currentUserId, currentUserProfile } = useAuth();

  const placeholder = sharedCity
    ? `e.g. Also heading to ${sharedCity} soon! 👋`
    : sharedUniversity
      ? `e.g. We're both going to ${sharedUniversity}! 👋`
      : "e.g. Hey! Saw we're both doing Erasmus — let's connect 👋";

  const handleSend = async () => {
    if (!note.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(studentId, note.trim());
      window.posthog?.capture("say_hi_sent");
      toast({ title: "Connect request sent!", description: `Your note was sent to ${studentName}.` });
      setNote("");

      // Check if this was the user's first message
      if (currentUserId && !localStorage.getItem("invitePromptSeen")) {
        const { count } = await supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("sender_id", currentUserId);

        if (count === 1) {
          setShowInviteModal(true);
          setSending(false);
          return;
        }
      }

      onOpenChange(false);
    } catch {
      toast({ title: "Failed to send", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && note.trim()) {
      e.preventDefault();
      handleSend();
    }
  };

  const refCode = currentUserProfile?.ref_code || "";

  return (
    <>
      <Dialog open={open && !showInviteModal} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect with {studentName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <p className="text-sm text-muted-foreground">
              Write a short note — it'll be sent as your first message.
            </p>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={MAX_CHARS}
              autoFocus
            />
            <p className={`text-xs text-right ${note.length > 80 ? "text-destructive" : "text-muted-foreground"}`}>
              {note.length}/{MAX_CHARS}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={!note.trim() || sending}>
              {sending ? "Sending…" : "Connect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {refCode && (
        <InviteFriendModal
          open={showInviteModal}
          onOpenChange={(v) => {
            setShowInviteModal(v);
            if (!v) onOpenChange(false);
          }}
          refCode={refCode}
        />
      )}
    </>
  );
};

export default ConnectModal;
