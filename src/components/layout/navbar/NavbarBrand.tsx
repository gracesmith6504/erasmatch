
import { Link } from "react-router-dom";

export const NavbarBrand = () => {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex-shrink-0 flex items-center">
        <span className="text-xl font-bold gradient-text animate-pulse-soft">
          Eras<span className="text-erasmatch-green">Match</span> 🌍
        </span>
      </Link>
    </div>
  );
};
