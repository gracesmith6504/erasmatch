import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getTagInfo, getTagBgColor } from "@/components/profile/constants";

interface PersonalityTagsProps {
  tags: string[] | null | undefined;
}

const PersonalityTags: React.FC<PersonalityTagsProps> = ({ tags }) => {
  const [showAllTags, setShowAllTags] = useState(false);

  if (!tags || tags.length === 0) return null;

  const defaultVisibleTags = ["looking-to-meet", "weekend-trips", "clubbing"];
  const priorityTags = tags.filter(tag => defaultVisibleTags.includes(tag));
  const visibleTags = priorityTags.length > 0 ? priorityTags.slice(0, 3) : tags.slice(0, 3);
  const hiddenTags = tags.filter(tag => !visibleTags.includes(tag));
  const hasMoreTags = hiddenTags.length > 0;

  return (
    <div className="flex flex-col items-center mt-2">
      <div className="flex flex-wrap justify-center gap-1.5">
        {visibleTags.map((tag) => {
          const tagInfo = getTagInfo(tag);
          return (
            <Badge key={tag} className={`${getTagBgColor(tag)} text-sm px-3 py-1`}>
              {tagInfo?.icon} {tagInfo?.label}
            </Badge>
          );
        })}
      </div>
      
      {hasMoreTags && (
        <>
          <div className={`${showAllTags ? 'flex' : 'hidden sm:flex'} flex-wrap justify-center gap-1 mt-1`}>
            {hiddenTags.map((tag) => {
              const tagInfo = getTagInfo(tag);
              return (
                <Badge key={tag} className={`${getTagBgColor(tag)} text-sm px-3 py-1`}>
                  {tagInfo?.icon} {tagInfo?.label}
                </Badge>
              );
            })}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllTags(!showAllTags)}
            className="mt-1 text-xs text-erasmatch-green sm:hidden flex items-center p-0 h-6"
          >
            {showAllTags ? (
              <>Show Less <ChevronUp className="ml-0.5 h-3 w-3" /></>
            ) : (
              <>View {hiddenTags.length} More <ChevronDown className="ml-0.5 h-3 w-3" /></>
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default PersonalityTags;