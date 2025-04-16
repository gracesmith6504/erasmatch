
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ShareModal } from "./ShareModal";

interface PostSignupPromptProps {
  city?: string;
  onContinue: () => void;
  link: string;
}

export function PostSignupPrompt({ city, onContinue, link }: PostSignupPromptProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <Card className="p-6 text-center space-y-6">
        <div className="text-5xl">🎉</div>
        <h1 className="text-2xl font-bold">You're in!</h1>
        
        <p className="text-gray-600">
          {city 
            ? `Want to invite others heading to ${city}? Share ErasMatch with them.`
            : "Want to invite your friends? Share ErasMatch with them."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            className="flex-1"
            onClick={() => setIsShareModalOpen(true)}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share ErasMatch
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onContinue}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
      
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        city={city}
        link={link}
      />
    </div>
  );
}
