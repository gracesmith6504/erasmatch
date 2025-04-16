
import { Menu, X } from "lucide-react";

interface MobileNavToggleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const MobileNavToggle = ({ isOpen, setIsOpen }: MobileNavToggleProps) => {
  return (
    <div className="flex items-center md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center p-3 rounded-md text-gray-700 hover:text-erasmatch-blue focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="block h-6 w-6" />
        ) : (
          <Menu className="block h-6 w-6" />
        )}
      </button>
    </div>
  );
};
