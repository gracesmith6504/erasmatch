
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { PERSONALITY_TAGS } from "../constants";

type PersonalityTagsSectionProps = {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
};

export const PersonalityTagsSection = ({ 
  selectedTags, 
  onToggleTag 
}: PersonalityTagsSectionProps) => {
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

  return (
    <div className="mt-6">
      <Label htmlFor="personality-tags" className="block text-sm font-medium text-gray-700 mb-3">
        What describes you?
      </Label>

      <div className="border rounded-md p-4">
        <div className="flex flex-wrap gap-2 mt-2">
          {PERSONALITY_TAGS.map((tag) => {
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

      {/* Display selected tags */}
      {selectedTags && selectedTags.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => {
              const tagInfo = PERSONALITY_TAGS.find(t => t.value === tag);
              return (
                <Badge
                  key={tag}
                  className={`${getTagColor(tag)}`}
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
