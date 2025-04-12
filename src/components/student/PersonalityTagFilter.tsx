
import React from "react";
import { ALL_PERSONALITY_TAG_OPTIONS, getTagColorClass } from "@/components/profile/PersonalityTagSelector";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Tags } from "lucide-react";

interface PersonalityTagFilterProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const PersonalityTagFilter = ({ selectedTags, onTagToggle }: PersonalityTagFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Tags className="h-4 w-4 text-gray-500 mr-2" />
        <Label className="text-sm font-medium">Filter by Personality Tags</Label>
      </div>
      
      <Separator />
      
      <div className="flex flex-wrap gap-2">
        {ALL_PERSONALITY_TAG_OPTIONS.map((tag) => (
          <Toggle
            key={tag}
            pressed={selectedTags.includes(tag)}
            onPressedChange={() => onTagToggle(tag)}
            variant="outline"
            size="sm"
            className={`
              rounded-full text-xs 
              ${selectedTags.includes(tag) ? getTagColorClass(tag) : 'bg-gray-50'}
              transition-all duration-200 hover:bg-opacity-90
            `}
          >
            {tag}
          </Toggle>
        ))}
      </div>
    </div>
  );
};

export default PersonalityTagFilter;
