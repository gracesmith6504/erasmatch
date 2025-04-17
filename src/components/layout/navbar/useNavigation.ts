
import { useLocation } from "react-router-dom";
import { Home, MessageSquare, Users } from "lucide-react";

export const useNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
    {
      name: "Students",
      path: "/students",
      icon: Users,
    },
    {
      name: "Messages",
      path: "/messages",
      icon: MessageSquare,
    },
    {
      name: "Groups",
      path: "/groups",
      icon: Users,
    }
  ];

  return {
    isActive,
    navigationItems,
  };
};
