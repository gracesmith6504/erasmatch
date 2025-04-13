
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ManualUniversityEntryProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReturn: () => void;
  required?: boolean;
};

export function ManualUniversityEntry({ 
  value, 
  onChange, 
  onReturn,
  required
}: ManualUniversityEntryProps) {
  return (
    <div className="space-y-2">
      <Input
        id="university"
        name="university"
        value={value}
        onChange={onChange}
        placeholder="Enter your university name"
        className="w-full"
        required={required}
      />
      <Button 
        variant="link" 
        onClick={onReturn}
        className="px-0 text-sm"
      >
        Return to university list
      </Button>
    </div>
  );
}
