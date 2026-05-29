
import { useLocation } from "react-router-dom";
import { Home, MessageSquare, Users } from "lucide-react";
import { useUnreadMessageCount } from "@/hooks/useUnreadMessageCount";
import { useAuth } from "@/contexts/AuthContext";

export const useNavigation = () => {
  const location = useLocation();
  const { currentUserId } = useAuth();
  const unreadCount = useUnreadMessageCount(currentUserId);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      name: "Home",
      path: "/",
      icon: Home,
      badge: 0,
    },
    {
      name: "Students",
      path: "/students",
      icon: Users,
      badge: 0,
    },
    {
      name: "Messages",
      path: "/messages",
      icon: MessageSquare,
      badge: unreadCount,
    },
    {
      name: "Groups",
      path: "/groups",
      icon: Users,
      badge: 0,
    }
  ];

  return {
    isActive,
    navigationItems,
  };
};
