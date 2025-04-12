
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type AboutMeSectionProps = {
  bio: string | null;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const AboutMeSection = ({ bio, handleChange }: AboutMeSectionProps) => {
  return (
    <div>
      <Label htmlFor="bio" className="block text-sm font-medium text-gray-700">
        About Me
      </Label>
      <Textarea
        id="bio"
        name="bio"
        value={bio || ""}
        onChange={handleChange}
        placeholder="Tell others about yourself, your interests, and what you're looking forward to in your Erasmus experience"
        rows={4}
        className="mt-1"
      />
    </div>
  );
};
