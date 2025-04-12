
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ALL_PERSONALITY_TAGS = {
  "Travel & Adventure": [
    "🗺️ Weekend Trips",
    "🏖️ Beach Days", 
    "🚆 Train Adventures"
  ],
  "Nightlife": [
    "🍻 Pub Nights", 
    "🕺 Clubbing"
  ],
  "Interests": [
    "🏅 Sport", 
    "🎧 Music Lover", 
    "📸 Photography", 
    "🎨 Artsy", 
    "🧘 Mindfulness", 
    "📚 Bookworm", 
    "☕ Café Hunting"
  ],
  "Social Style": [
    "🧑‍🤝‍🧑 Social Butterfly", 
    "🌿 Go with the Flow", 
    "👀 Looking to meet new people"
  ]
};

// Flattened list of all tags
const ALL_TAGS = Object.values(ALL_PERSONALITY_TAGS).flat();

// Color mapping for tags to ensure consistent colors
const TAG_COLORS: Record<string, string> = {
  "🗺️ Weekend Trips": "bg-blue-50 text-blue-700",
  "🏖️ Beach Days": "bg-amber-50 text-amber-700",
  "🚆 Train Adventures": "bg-green-50 text-green-700",
  "🍻 Pub Nights": "bg-orange-50 text-orange-700",
  "🕺 Clubbing": "bg-purple-50 text-purple-700",
  "🏅 Sport": "bg-emerald-50 text-emerald-700",
  "🎧 Music Lover": "bg-pink-50 text-pink-700",
  "📸 Photography": "bg-indigo-50 text-indigo-700",
  "🎨 Artsy": "bg-rose-50 text-rose-700",
  "🧘 Mindfulness": "bg-cyan-50 text-cyan-700",
  "📚 Bookworm": "bg-violet-50 text-violet-700",
  "☕ Café Hunting": "bg-yellow-50 text-yellow-700",
  "🧑‍🤝‍🧑 Social Butterfly": "bg-lime-50 text-lime-700",
  "🌿 Go with the Flow": "bg-teal-50 text-teal-700",
  "👀 Looking to meet new people": "bg-sky-50 text-sky-700",
};

interface PersonalityTagSelectorProps {
  value: string[] | null;
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export const PersonalityTagSelector = ({
  value = [],
  onChange,
  maxTags = 5
}: PersonalityTagSelectorProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(value || []);

  // Update local state when prop value changes
  useEffect(() => {
    setSelectedTags(value || []);
  }, [value]);

  const handleTagToggle = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    let updatedTags: string[];
    
    if (isSelected) {
      // Remove tag if already selected
      updatedTags = selectedTags.filter(t => t !== tag);
    } else {
      // Add tag if under max limit
      if (selectedTags.length < maxTags) {
        updatedTags = [...selectedTags, tag];
      } else {
        // At max tags limit
        return;
      }
    }
    
    setSelectedTags(updatedTags);
    onChange(updatedTags);
  };

  return (
    <div className="space-y-4">
      {/* Selected tags display */}
      <div className="mb-4">
        <div className="text-sm font-medium mb-2">Selected Tags ({selectedTags.length}/{maxTags})</div>
        <div className="flex flex-wrap gap-2">
          {selectedTags.length > 0 ? (
            selectedTags.map(tag => (
              <Badge 
                key={tag}
                className={`${TAG_COLORS[tag]} cursor-pointer transition-all hover:opacity-80`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag} ×
              </Badge>
            ))
          ) : (
            <div className="text-sm text-gray-500 italic">No tags selected</div>
          )}
        </div>
      </div>
      
      {/* Tag categories */}
      <div className="space-y-6">
        {Object.entries(ALL_PERSONALITY_TAGS).map(([category, tags]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">{category}</h4>
            
            <div className="grid grid-cols-2 gap-2">
              {tags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                const isDisabled = !isSelected && selectedTags.length >= maxTags;
                
                return (
                  <div 
                    key={tag}
                    className={`
                      flex items-center space-x-2 p-2 rounded
                      ${isSelected ? 'bg-gray-100' : ''}
                      ${isDisabled ? 'opacity-50' : 'cursor-pointer hover:bg-gray-50'}
                    `}
                    onClick={() => !isDisabled && handleTagToggle(tag)}
                  >
                    <Checkbox 
                      checked={isSelected}
                      disabled={isDisabled} 
                      onCheckedChange={() => !isDisabled && handleTagToggle(tag)}
                      className="data-[state=checked]:bg-erasmatch-blue data-[state=checked]:text-white"
                    />
                    <Label className="text-sm cursor-pointer">{tag}</Label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the color mapping for reuse in other components
export const getTagColorClass = (tag: string): string => {
  return TAG_COLORS[tag] || "bg-gray-100 text-gray-800";
};

export const ALL_PERSONALITY_TAG_OPTIONS = ALL_TAGS;
