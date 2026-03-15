
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { PERSONALITY_TAGS } from "../constants";

type PersonalityTagsSectionProps = {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
};

export const PersonalityTagsSection = ({ 
  selectedTags, 
  onToggleTag 
}: PersonalityTagsSectionProps) => {
  const [showAllTags, setShowAllTags] = useState(false);
  
  // Generate a tag color based on the tag name for consistent coloring
  const getTagColor = (tag: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-yellow-100 text-yellow-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-orange-100 text-orange-800",
      "bg-teal-100 text-teal-800",
    ];
    
    // Use the tag string to pick a consistent color
    const index = tag.length % colors.length;
    return colors[index];
  };

  // Define the default visible tags
  const defaultVisibleTags = ["looking-to-meet", "weekend-trips", "clubbing"];
  
  // Separate tags into priority (default visible) and others
  const priorityTagsData = PERSONALITY_TAGS.filter(tag => 
    defaultVisibleTags.includes(tag.value)
  );
  
  const otherTagsData = PERSONALITY_TAGS.filter(tag => 
    !defaultVisibleTags.includes(tag.value)
  );

  return (
    <div className="mt-6">
      <Label htmlFor="personality-tags" className="block text-sm font-medium text-gray-700 mb-3">
        What describes you?
      </Label>

      <div className="border rounded-md p-4">
        <div className="flex flex-wrap gap-2">
          {/* Priority tags - always visible */}
          {priorityTagsData.map((tag) => {
            const isSelected = selectedTags?.includes(tag.value);
            return (
              <Badge
                key={tag.value}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  isSelected ? getTagColor(tag.value) : "hover:bg-gray-100"
                }`}
                onClick={() => onToggleTag(tag.value)}
              >
                {tag.icon} {tag.label}
                {isSelected && <X className="h-3 w-3 ml-1" />}
              </Badge>
            );
          })}

          {/* Non-priority tags - hidden on mobile by default, always visible on desktop */}
          <div className={`${showAllTags ? 'flex' : 'hidden sm:flex'} flex-wrap gap-2 w-full sm:w-auto`}>
            {otherTagsData.map((tag) => {
              const isSelected = selectedTags?.includes(tag.value);
              return (
                <Badge
                  key={tag.value}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    isSelected ? getTagColor(tag.value) : "hover:bg-gray-100"
                  }`}
                  onClick={() => onToggleTag(tag.value)}
                >
                  {tag.icon} {tag.label}
                  {isSelected && <X className="h-3 w-3 ml-1" />}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Toggle button - only visible on mobile */}
        <Button
          type="button" // ✅ prevent form submission
          variant="ghost"
          size="sm"
          onClick={() => setShowAllTags(!showAllTags)}
          className="mt-3 text-sm text-blue-600 sm:hidden flex items-center"
        >
          {showAllTags ? (
            <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
          ) : (
            <>View More <ChevronDown className="ml-1 h-4 w-4" /></>
          )}
        </Button>
      </div>

    </div>
  );
};
