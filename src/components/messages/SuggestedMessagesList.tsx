
import { useState } from "react";
import { Check, Edit } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { SuggestedMessage } from "./SuggestedMessage";
import { useData } from "@/contexts/DataContext";

type SuggestedMessagesListProps = {
  suggestions: string[];
  onSelectMessage: (text: string) => void;
  currentMessage: string;
  receiverId: string;
  currentUserId: string;
};

export const SuggestedMessagesList = ({
  suggestions,
  onSelectMessage,
  currentMessage,
  receiverId,
  currentUserId
}: SuggestedMessagesListProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const { logPrompt } = useData();

  const handleSuggestionClick = (text: string) => {
    if (currentMessage.trim()) {
      setSelectedMessage(text);
      setShowConfirmation(true);
    } else {
      applySelectedMessage(text);
    }
  };

  const applySelectedMessage = async (text: string) => {
    onSelectMessage(text);
    
    // Add a small animation to show the message was applied
    const messageInputEl = document.querySelector('.message-input');
    if (messageInputEl) {
      messageInputEl.classList.add('animate-pulse-soft');
      setTimeout(() => {
        messageInputEl.classList.remove('animate-pulse-soft');
      }, 1000);
    }
    
    // Log the prompt usage
    if (currentUserId && receiverId) {
      await logPrompt(currentUserId, receiverId, text, 'message_suggestion');
    }
  };

  const handleConfirmReplacement = () => {
    applySelectedMessage(selectedMessage);
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="mb-3">
        <p className="text-sm text-muted-foreground mb-2">Not sure what to say? Try one of these:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <SuggestedMessage 
              key={index}
              text={suggestion}
              onClick={handleSuggestionClick}
            />
          ))}
        </div>
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace your message?</AlertDialogTitle>
            <AlertDialogDescription>
              You already have text in your message field. Do you want to replace it with the suggested message?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReplacement} className="gap-1.5">
              <Check className="h-4 w-4" />
              Replace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
