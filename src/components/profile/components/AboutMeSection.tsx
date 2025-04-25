
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type AboutMeSectionProps = {
  bio: string | null;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const AboutMeSection = ({ bio, handleChange }: AboutMeSectionProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="bio" className="block text-base font-medium text-gray-700">
        About Me
      </Label>
      <Textarea
        id="bio"
        name="bio"
        value={bio || ""}
        onChange={handleChange}
        placeholder="Tell others about yourself, your interests, and what you're looking forward to in your Erasmus experience"
        rows={4}
        className="mt-1 w-full rounded-xl border-gray-200 bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 focus:border-erasmatch-green focus:ring-erasmatch-green resize-none placeholder:text-gray-400"
      />
    </div>
  );
};
