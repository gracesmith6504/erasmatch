
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
      "bg-green-100/80 text-green-800 hover:bg-green-200/80 border-green-200",
      "bg-blue-100/80 text-blue-800 hover:bg-blue-200/80 border-blue-200",
      "bg-purple-100/80 text-purple-800 hover:bg-purple-200/80 border-purple-200",
      "bg-yellow-100/80 text-yellow-800 hover:bg-yellow-200/80 border-yellow-200",
      "bg-pink-100/80 text-pink-800 hover:bg-pink-200/80 border-pink-200",
      "bg-indigo-100/80 text-indigo-800 hover:bg-indigo-200/80 border-indigo-200",
      "bg-orange-100/80 text-orange-800 hover:bg-orange-200/80 border-orange-200",
      "bg-teal-100/80 text-teal-800 hover:bg-teal-200/80 border-teal-200",
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

      <div className="border rounded-xl p-6 bg-white/70 backdrop-blur-sm shadow-soft hover:shadow-md transition-all duration-300">
        <div className="flex flex-wrap gap-2.5">
          {priorityTagsData.map((tag) => {
            const isSelected = selectedTags?.includes(tag.value);
            return (
              <Badge
                key={tag.value}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 rounded-full px-3 py-1.5 ${
                  isSelected 
                    ? `${getTagColor(tag.value)} shadow-sm` 
                    : "hover:bg-gray-100 border border-gray-200"
                }`}
                onClick={() => onToggleTag(tag.value)}
              >
                {tag.icon} {tag.label}
                {isSelected && <X className="h-3 w-3 ml-1.5" />}
              </Badge>
            );
          })}

          <div className={`${showAllTags ? 'flex' : 'hidden sm:flex'} flex-wrap gap-2.5 w-full sm:w-auto`}>
            {otherTagsData.map((tag) => {
              const isSelected = selectedTags?.includes(tag.value);
              return (
                <Badge
                  key={tag.value}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 rounded-full px-3 py-1.5 ${
                    isSelected 
                      ? `${getTagColor(tag.value)} shadow-sm` 
                      : "hover:bg-gray-100 border border-gray-200"
                  }`}
                  onClick={() => onToggleTag(tag.value)}
                >
                  {tag.icon} {tag.label}
                  {isSelected && <X className="h-3 w-3 ml-1.5" />}
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
          className="mt-4 text-sm text-erasmatch-green hover:text-erasmatch-darkgreen sm:hidden flex items-center transition-colors duration-300"
        >
          {showAllTags ? (
            <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
          ) : (
            <>View More <ChevronDown className="ml-1 h-4 w-4" /></>
          )}
        </Button>
      </div>

      {selectedTags && selectedTags.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-gray-50/90 backdrop-blur-sm border border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Tags:</h4>
          <div className="flex flex-wrap gap-2.5">
            {selectedTags.map((tag) => {
              const tagInfo = PERSONALITY_TAGS.find(t => t.value === tag);
              return (
                <Badge
                  key={tag}
                  className={`${getTagColor(tag)} transform transition-all duration-300 hover:scale-105 rounded-full px-3 py-1.5 shadow-sm animate-fade-in`}
                >
                  {tagInfo?.icon} {tagInfo?.label}
                  <button 
                    className="ml-1.5" 
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
