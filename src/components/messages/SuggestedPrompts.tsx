
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Profile } from "@/types";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  onDismiss: () => void;
  currentUserProfile?: Profile | null;
  partnerProfile?: Profile | null;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  onSelectPrompt,
  onDismiss,
  currentUserProfile,
  partnerProfile,
}) => {
  // Static prompts as requested
  const staticPrompts = [
    "hey 👋",
  ];

  // Dynamic prompts based on profile data
  const dynamicPrompts: string[] = [];
  
  if (currentUserProfile && partnerProfile) {
    // Same city match
    if (currentUserProfile.city && 
        partnerProfile.city && 
        currentUserProfile.city === partnerProfile.city) {
      dynamicPrompts.push(`Hey! I saw you're also going to ${partnerProfile.city} — do you have housing yet?`);
    }
    
    // Same home university match
    if (currentUserProfile.home_university && 
        partnerProfile.home_university && 
        currentUserProfile.home_university === partnerProfile.home_university) {
      dynamicPrompts.push(`Saw you're also from ${partnerProfile.home_university}, had to say hey 👋`);
    }
    
    // Same destination university match
    if (currentUserProfile.university && 
        partnerProfile.university && 
        currentUserProfile.university === partnerProfile.university) {
      dynamicPrompts.push(`hi! saw ur also going to ${partnerProfile.university}, thought i'd say hey 👋`);
    }
  }
  
  // Combine all prompts and remove duplicates
  const allPrompts = Array.from(new Set([...staticPrompts, ...dynamicPrompts]));
  
  // Shuffle the prompts to randomize order
  const shuffledPrompts = [...allPrompts].sort(() => Math.random() - 0.5);

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
        {shuffledPrompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-full transition-all"
            onClick={() => onSelectPrompt(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </Card>
  );
};
