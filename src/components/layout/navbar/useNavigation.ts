
import { useLocation } from "react-router-dom";
import { Home, MessageSquare, Users, User, MessageCircle } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

export const useNavigation = () => {
  const location = useLocation();
  const { messages } = useData();
  const { currentUserId } = useAuth();

  // Check if there are any unread messages
  const hasUnreadMessages = messages.some(msg => 
    msg.receiver_id === currentUserId && msg.read === false
  );

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
      icon: hasUnreadMessages ? MessageCircle : MessageSquare,
      hasNotification: hasUnreadMessages,
    },
    {
      name: "Groups",
      path: "/groups",
      icon: Users,
    },
  ];

  return {
    isActive,
    navigationItems,
    hasUnreadMessages,
  };
};
