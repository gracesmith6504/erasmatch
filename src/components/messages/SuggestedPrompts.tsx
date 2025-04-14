
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const SuggestedPrompts = ({ onSelectPrompt }: SuggestedPromptsProps) => {
  const [visible, setVisible] = useState(true);

  // Static prompts for now
  const prompts = [
    "hey 👋",
    "yo — you headed to the same uni?",
    "still looking for a place to stay?"
  ];

  if (!visible) return null;

  return (
    <div className="p-3 bg-white rounded-lg shadow-sm border mb-2 relative animate-fade-in">
      <button 
        onClick={() => setVisible(false)}
        className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded-full"
        aria-label="Dismiss suggestions"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>
      
      <p className="text-sm text-gray-600 mb-2">Not sure what to say? Try one of these!</p>
      
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <Badge
            key={index}
            variant="outline"
            className="py-1.5 px-3 bg-white hover:bg-gray-50 cursor-pointer hover-scale text-gray-800 shadow-soft"
            onClick={() => onSelectPrompt(prompt)}
          >
            💬 {prompt}
          </Badge>
        ))}
      </div>
    </div>
  );
};
