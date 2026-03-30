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

const MAX_CHARS = 100;

interface ConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentName: string;
  /** Optional shared city for placeholder hint */
  sharedCity?: string | null;
  /** Optional shared university for placeholder hint */
  sharedUniversity?: string | null;
  /** Optional pre-filled note */
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
  const sendMessage = useSendMessage();

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
      toast({ title: "Connect request sent!", description: `Your note was sent to ${studentName}.` });
      setNote("");
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};

export default ConnectModal;
