
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
      "bg-blue-100/80 text-blue-800 hover:bg-blue-200/80",
      "bg-green-100/80 text-green-800 hover:bg-green-200/80",
      "bg-purple-100/80 text-purple-800 hover:bg-purple-200/80",
      "bg-yellow-100/80 text-yellow-800 hover:bg-yellow-200/80",
      "bg-pink-100/80 text-pink-800 hover:bg-pink-200/80",
      "bg-indigo-100/80 text-indigo-800 hover:bg-indigo-200/80",
      "bg-orange-100/80 text-orange-800 hover:bg-orange-200/80",
      "bg-teal-100/80 text-teal-800 hover:bg-teal-200/80",
    ];
    
    const index = tag.length % colors.length;
    return colors[index];
  };

  const defaultVisibleTags = ["looking-to-meet", "weekend-trips", "clubbing"];
  const priorityTagsData = PERSONALITY_TAGS.filter(tag => defaultVisibleTags.includes(tag.value));
  const otherTagsData = PERSONALITY_TAGS.filter(tag => !defaultVisibleTags.includes(tag.value));

  return (
    <div className="mt-8">
      <Label htmlFor="personality-tags" className="block text-base font-medium text-gray-700 mb-4">
        What describes you?
      </Label>

      <div className="border rounded-xl p-6 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-wrap gap-2">
          {priorityTagsData.map((tag) => {
            const isSelected = selectedTags?.includes(tag.value);
            return (
              <Badge
                key={tag.value}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  isSelected ? getTagColor(tag.value) : "hover:bg-gray-100"
                }`}
                onClick={() => onToggleTag(tag.value)}
              >
                {tag.icon} {tag.label}
                {isSelected && <X className="h-3 w-3 ml-1" />}
              </Badge>
            );
          })}

          <div className={`${showAllTags ? 'flex' : 'hidden sm:flex'} flex-wrap gap-2 w-full sm:w-auto`}>
            {otherTagsData.map((tag) => {
              const isSelected = selectedTags?.includes(tag.value);
              return (
                <Badge
                  key={tag.value}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
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

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowAllTags(!showAllTags)}
          className="mt-4 text-sm text-erasmatch-blue hover:text-erasmatch-purple sm:hidden flex items-center transition-colors duration-300"
        >
          {showAllTags ? (
            <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
          ) : (
            <>View More <ChevronDown className="ml-1 h-4 w-4" /></>
          )}
        </Button>
      </div>

      {selectedTags && selectedTags.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-gray-50/80 backdrop-blur-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => {
              const tagInfo = PERSONALITY_TAGS.find(t => t.value === tag);
              return (
                <Badge
                  key={tag}
                  className={`${getTagColor(tag)} transform transition-all duration-300 hover:scale-105`}
                >
                  {tagInfo?.icon} {tagInfo?.label}
                  <button 
                    className="ml-1" 
                    onClick={() => onToggleTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
