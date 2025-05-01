
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeftCircle, SaveIcon } from "lucide-react";

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
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          id="university"
          name="university"
          value={value}
          onChange={onChange}
          placeholder="Enter your university name"
          className="w-full"
          required={required}
          autoFocus
        />
        <Button 
          type="button"
          className="shrink-0 bg-erasmatch-green hover:bg-erasmatch-green/90"
          onClick={onReturn}
          disabled={!value}
        >
          Save
        </Button>
      </div>
      <Button 
        variant="ghost" 
        onClick={onReturn}
        className="px-0 text-sm flex gap-1 items-center text-gray-500 hover:text-gray-700"
        type="button"
      >
        <ArrowLeftCircle className="h-4 w-4" />
        Return to university list
      </Button>
    </div>
  );
}
