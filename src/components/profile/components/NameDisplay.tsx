
import { Input } from "@/components/ui/input";

type NameDisplayProps = {
  name: string | null;
  email: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const NameDisplay = ({ name, email, handleChange }: NameDisplayProps) => {
  return (
    <div>
      <Input
        id="name"
        name="name"
        value={name || ""}
        onChange={handleChange}
        placeholder="Your full name"
        required
        className="text-center text-lg font-semibold border-none focus:ring-0 bg-transparent"
      />
      
      <div className="text-sm text-gray-500">
        {email}
      </div>
    </div>
  );
};
