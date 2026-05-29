import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const LOOKING_FOR_OPTIONS = [
  { value: "flatmate", label: "Flatmate", icon: "🏠" },
  { value: "travel-buddy", label: "Travel Buddy", icon: "✈️" },
  { value: "language-exchange", label: "Language Exchange", icon: "🗣️" },
  { value: "friends", label: "Friends", icon: "🤝" },
];

type LookingForSectionProps = {
  selectedOptions: string[];
  onToggleOption: (option: string) => void;
};

export const LookingForSection = ({
  selectedOptions,
  onToggleOption,
}: LookingForSectionProps) => {
  return (
    <div className="mt-6">
      <Label className="block text-sm font-medium text-foreground mb-3">
        🔍 What are you looking for?
      </Label>
      <div className="flex flex-wrap gap-2">
        {LOOKING_FOR_OPTIONS.map((option) => {
          const isSelected = selectedOptions.includes(option.value);
          return (
            <Badge
              key={option.value}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all text-sm px-4 py-2 ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              onClick={() => onToggleOption(option.value)}
            >
              {option.icon} {option.label}
              {isSelected && <X className="h-3 w-3 ml-1" />}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export { LOOKING_FOR_OPTIONS };
