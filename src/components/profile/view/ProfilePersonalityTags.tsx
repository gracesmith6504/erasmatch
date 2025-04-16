
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getTagInfo, getTagBgColor } from "@/components/profile/constants";

type ProfilePersonalityTagsProps = {
  tags?: string[] | null;
};

export const ProfilePersonalityTags = ({ tags }: ProfilePersonalityTagsProps) => {
  const [showAllTags, setShowAllTags] = useState(false);
  
  if (!tags || tags.length === 0) {
    return null;
  }

  const defaultVisibleTags = ["looking-to-meet", "weekend-trips", "clubbing"];
  
  // Tags to show on mobile (first 3 priority tags if they exist, otherwise first 3 tags)
  const priorityTags = tags.filter(tag => defaultVisibleTags.includes(tag));
  const visibleTags = priorityTags.length > 0 ? priorityTags : tags.slice(0, 3);
  const hiddenTags = tags.filter(tag => !visibleTags.includes(tag));
  
  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium text-gray-900 mb-2">Personality</h2>
      <div className="flex flex-wrap gap-2">
        {/* Always visible tags (or the priority ones on mobile) */}
        {visibleTags.map((tag) => {
          const tagInfo = getTagInfo(tag);
          return (
            <Badge key={tag} className={`${getTagBgColor(tag)}`}>
              {tagInfo?.icon} {tagInfo?.label}
            </Badge>
          );
        })}

        {/* Hidden tags on mobile, visible on desktop */}
        {!showAllTags && hiddenTags.length > 0 && (
          <div className="hidden sm:flex flex-wrap gap-2">
            {hiddenTags.map((tag) => {
              const tagInfo = getTagInfo(tag);
              return (
                <Badge key={tag} className={`${getTagBgColor(tag)}`}>
                  {tagInfo?.icon} {tagInfo?.label}
                </Badge>
              );
            })}
          </div>
        )}

        {/* Tags that show when "View More" is clicked on mobile */}
        {showAllTags && hiddenTags.length > 0 && (
          <div className="flex sm:hidden flex-wrap gap-2">
            {hiddenTags.map((tag) => {
              const tagInfo = getTagInfo(tag);
              return (
                <Badge key={tag} className={`${getTagBgColor(tag)}`}>
                  {tagInfo?.icon} {tagInfo?.label}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Toggle button - only visible on mobile if there are hidden tags */}
      {hiddenTags.length > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowAllTags(!showAllTags)} 
          className="mt-2 text-sm text-blue-600 sm:hidden flex items-center"
        >
          {showAllTags ? (
            <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
          ) : (
            <>View More <ChevronDown className="ml-1 h-4 w-4" /></>
          )}
        </Button>
      )}
    </div>
  );
};
