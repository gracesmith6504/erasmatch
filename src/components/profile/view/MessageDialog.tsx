
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type MessageDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSendMessage: () => void;
  messageContent: string;
  setMessageContent: (content: string) => void;
  isSending: boolean;
  recipientName: string;
};

export const MessageDialog = ({
  isOpen,
  onOpenChange,
  onSendMessage,
  messageContent,
  setMessageContent,
  isSending,
  recipientName
}: MessageDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message to {recipientName}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Write your message here..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            className="min-h-32"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={onSendMessage} 
            disabled={!messageContent.trim() || isSending}
          >
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
