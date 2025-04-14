
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NavbarStateProps {
  isAuthenticated: boolean;
  currentUserId?: string;
}

export const useNavbarState = ({ isAuthenticated, currentUserId }: NavbarStateProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  // Close mobile menu on navigation
  useEffect(() => {
    const handleNavigation = () => {
      setIsOpen(false);
    };

    // Clean up event listener
    return () => {
      handleNavigation();
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Check for unread messages and set up real-time monitoring
  useEffect(() => {
    if (!isAuthenticated || !currentUserId) return;

    // Function to check for unread messages
    const checkUnreadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("id")
          .eq("receiver_id", currentUserId)
          .eq("read", false)
          .limit(1);
        
        if (error) {
          console.error("Error checking for unread messages:", error);
          return;
        }

        setHasUnreadMessages(Boolean(data?.length));
      } catch (error) {
        console.error("Error in checkUnreadMessages:", error);
      }
    };

    // Initial check
    checkUnreadMessages();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('navbar-message-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${currentUserId}`
      }, () => {
        checkUnreadMessages();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${currentUserId}`
      }, () => {
        checkUnreadMessages();
      })
      .subscribe();
    
    // Also poll for new messages as a fallback
    const interval = setInterval(checkUnreadMessages, 15000); // 15 seconds
    
    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [currentUserId, isAuthenticated]);

  return {
    isOpen,
    setIsOpen,
    scrolled,
    hasUnreadMessages
  };
};
