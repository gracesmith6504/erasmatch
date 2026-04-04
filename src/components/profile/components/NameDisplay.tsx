
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type NameDisplayProps = {
  name: string | null;
  email: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const NameDisplay = ({ name, email, handleChange }: NameDisplayProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  return (
    <div className="relative">
      {isEditing ? (
        <div className="flex items-center">
          <Input
            id="name"
            name="name"
            value={name || ""}
            onChange={handleChange}
            placeholder="Your full name"
            required
            autoFocus={!isMobile}
            className="text-center text-lg font-semibold border-none focus:ring-0 bg-transparent"
          />
          <Button 
            type="button"
            variant="ghost" 
            size="sm" 
            className="absolute right-0 text-gray-500 hover:text-gray-700"
            onClick={handleSaveClick}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <h2 className="text-center text-lg font-semibold">
            {name || "Your full name"}
          </h2>
          <Button 
            type="button"
            variant="ghost" 
            size="sm" 
            className="ml-2 text-gray-500 hover:text-gray-700"
            onClick={toggleEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Only show email on user's own profile */}
      <div className="text-sm text-center text-gray-500">
        {email}
      </div>
    </div>
  );
};
