
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  onDismiss: () => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  onSelectPrompt,
  onDismiss,
}) => {
  // Static prompts as requested
  const prompts = [
    "hey 👋",
    "yo — you headed to the same uni?",
    "still looking for a place to stay?",
  ];

  // Handle prompt selection with any necessary cleanup
  const handleSelectPrompt = (prompt: string) => {
    console.log("Prompt selected:", prompt);
    onSelectPrompt(prompt);
  };

  return (
    <Card className="p-3 mb-2 relative rounded-lg shadow-sm border-gray-200 bg-white/70 backdrop-blur-sm">
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute right-0 top-0 p-1 h-auto w-auto" 
        onClick={onDismiss}
      >
        <X className="h-4 w-4 text-gray-500" />
      </Button>
      
      <div className="mb-2">
        <p className="text-sm text-gray-600">Not sure what to say? Try one of these!</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-full transition-all"
            onClick={() => handleSelectPrompt(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </Card>
  );
};
