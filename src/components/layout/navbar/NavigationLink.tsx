
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavigationLinkProps {
  to: string;
  isActive: boolean;
  className?: string;
  activeClass?: string;
  inactiveClass?: string;
  icon?: LucideIcon;
  badge?: number;
  children: React.ReactNode;
}

export const NavigationLink = ({
  to,
  isActive,
  className = "",
  activeClass = "",
  inactiveClass = "",
  icon: Icon,
  badge = 0,
  children
}: NavigationLinkProps) => {
  const baseClasses = className;
  const activeClasses = isActive ? activeClass : inactiveClass;

  return (
    <Link to={to} className={`${baseClasses} ${activeClasses}`}>
      <div className="flex items-center space-x-1.5">
        {Icon && (
          <span className="relative">
            <Icon className="w-4 h-4" />
            {badge > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1">
                {badge > 99 ? "99+" : badge}
              </span>
            )}
          </span>
        )}
        <span>{children}</span>
      </div>
    </Link>
  );
};
