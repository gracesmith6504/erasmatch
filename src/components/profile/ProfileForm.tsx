
import { Button } from "@/components/ui/button";
import { ProfileFormFields } from "./ProfileFormFields";

type ProfileFormProps = {
  form: {
    name: string;
    email: string;
    university: string;
    city: string;
    semester: string;
    bio: string;
    avatar_url: string;
  };
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleUniversityChange: (university: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
};

export function ProfileForm({
  form,
  loading,
  handleChange,
  handleSelectChange,
  handleUniversityChange,
  handleSubmit
}: ProfileFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProfileFormFields
        form={form}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        handleUniversityChange={handleUniversityChange}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
