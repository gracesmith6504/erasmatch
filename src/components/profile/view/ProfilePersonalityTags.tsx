
import { Badge } from "@/components/ui/badge";
import { getTagInfo, getTagBgColor } from "@/components/profile/constants";

type ProfilePersonalityTagsProps = {
  tags?: string[] | null;
};

export const ProfilePersonalityTags = ({ tags }: ProfilePersonalityTagsProps) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium text-gray-900 mb-2">Personality</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const tagInfo = getTagInfo(tag);
          return (
            <Badge key={tag} className={`${getTagBgColor(tag)}`}>
              {tagInfo?.icon} {tagInfo?.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
