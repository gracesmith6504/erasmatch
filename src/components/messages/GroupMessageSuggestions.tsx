
import { X } from "lucide-react";
import { useState } from "react";

interface GroupMessageSuggestionProps {
  chatType: "city" | "university";
  cityName?: string;
  universityName?: string;
  onSelectPrompt: (prompt: string) => void;
  onDismiss: () => void;
}

// Function to shuffle array (for randomizing prompt order)
const shuffleArray = (array: string[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const GroupMessageSuggestions = ({
  chatType,
  cityName = "",
  universityName = "",
  onSelectPrompt,
  onDismiss,
}: GroupMessageSuggestionProps) => {
  // Default fallback prompt for both chat types
  const fallbackPrompt = "hey 👋 just saying hi before things get busy";
  
  // Define suggestions based on chat type
  const [prompts] = useState(() => {
    const suggestions: string[] = [];
    
    if (chatType === "city" && cityName) {
      suggestions.push(
        `Any advice on which neighborhoods are good for erasmus housing in ${cityName}?`,
        `Are there any Erasmus meetups or events happening soon in ${cityName}?`,
        `Best cheap places to eat in ${cityName}?`,
        `Anyone arriving in ${cityName} early and wants to meet up?`,
        `Any advice on public transport in ${cityName}?`
      );
    } else if (chatType === "university" && universityName) {
      suggestions.push(
        `Best place to live near campus at ${universityName}?`,
        `Is anyone doing the orientation week at ${universityName}?`,
        `Are courses at ${universityName} mostly in English or do we need the local language?`
      );
    }
    
    // Always add the fallback prompt
    suggestions.push(fallbackPrompt);
    
    // Get 3 random prompts (or fewer if there aren't 3)
    return shuffleArray(suggestions).slice(0, 3);
  });

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-4 shadow-md border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm text-gray-700">Start the conversation</h3>
        <button 
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm transition-colors"
            onClick={() => onSelectPrompt(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
