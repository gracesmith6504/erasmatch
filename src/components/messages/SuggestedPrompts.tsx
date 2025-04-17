
import React, { useMemo } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Profile } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  onDismiss: () => void;
  currentUser?: Profile | null;
  selectedUser?: Profile | null;
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

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  onSelectPrompt,
  onDismiss,
  currentUser,
  selectedUser,
}) => {
  const isMobile = useIsMobile();
  
  // Generate personalized prompts based on user similarities
  const prompts = useMemo(() => {
    const suggestions: string[] = [];
    
    // Always include the fallback prompt
    suggestions.push("hey 👋");
    
    if (currentUser && selectedUser) {
      // Same university match
      if (currentUser.university && selectedUser.university && 
          currentUser.university === selectedUser.university) {
        suggestions.push(
          `Hey! Saw you're going to ${currentUser.university} too — nice to know someone else headed there.`,
          `Hey! Just saw we're both going to ${currentUser.university} — have you heard anything about student housing there?`
        );
      }
      
      // Same city match
      if (currentUser.city && selectedUser.city && 
          currentUser.city === selectedUser.city) {
        suggestions.push(
          `Hey, have you found accommodation in ${currentUser.city} yet?`,
          `Have you heard about any student events in ${currentUser.city}?`
        );
      }
      
      // Same home university match
      if (currentUser.home_university && selectedUser.home_university && 
          currentUser.home_university === selectedUser.home_university) {
        const cityToMention = currentUser.city || "your exchange destination";
        suggestions.push(
          `Hey! We're both from ${currentUser.home_university} — have you chatted with anyone else going to ${cityToMention}?`
        );
      }
    }
    
    // Get up to 3 random prompts (or all if there are fewer than 3)
    return shuffleArray(suggestions).slice(0, 3);
  }, [currentUser, selectedUser]);

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
      
      {isMobile ? (
        // Mobile scrollable container for suggested prompts
        <ScrollArea className="w-full px-1" orientation="horizontal">
          <div className="flex gap-2 pb-1 pr-4">
            {prompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-full transition-all whitespace-nowrap flex-shrink-0"
                onClick={() => handleSelectPrompt(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </ScrollArea>
      ) : (
        // Desktop layout with wrapping prompts
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
      )}
    </Card>
  );
};
