
import { MouseEvent } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SuggestedMessageProps = {
  text: string;
  onClick: (text: string) => void;
  className?: string;
};

export const SuggestedMessage = ({ text, onClick, className }: SuggestedMessageProps) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick(text);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("gap-1 py-1 px-3 h-auto text-sm", className)}
      onClick={handleClick}
    >
      <MessageSquare className="h-3.5 w-3.5" />
      <span>{text}</span>
    </Button>
  );
};
