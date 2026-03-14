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
        className="inline-flex items-center justify-center p-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </div>
  );
};