
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavigationLinkProps {
  to: string;
  isActive: boolean;
  className?: string;
  activeClass?: string;
  inactiveClass?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const NavigationLink = ({
  to,
  isActive,
  className = "",
  activeClass = "",
  inactiveClass = "",
  icon: Icon,
  children
}: NavigationLinkProps) => {
  const baseClasses = className;
  const activeClasses = isActive ? activeClass : inactiveClass;

  return (
    <Link to={to} className={`${baseClasses} ${activeClasses}`}>
      <div className="flex items-center space-x-1.5">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{children}</span>
      </div>
    </Link>
  );
};
