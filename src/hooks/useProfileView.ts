
import { useState, useEffect } from "react";
import { Profile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProfileView = (
  profile: Profile | undefined,
  currentUserId: string | null,
  onSendMessage: (receiverId: string, content: string) => Promise<void>
) => {
  const [universityCity, setUniversityCity] = useState<string | null>(null);
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchUniversityCity = async () => {
      if (!profile?.university) return;
      
      setIsLoadingCity(true);
      try {
        const { data, error } = await supabase
          .from('universities')
          .select('city')
          .eq('name', profile.university)
          .single();

        if (error) throw error;
        setUniversityCity(data?.city || null);
      } catch (error) {
        console.error("Error fetching university city:", error);
      } finally {
        setIsLoadingCity(false);
      }
    };

    fetchUniversityCity();
  }, [profile?.university]);

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !profile?.id || !currentUserId) return;
    
    setIsSending(true);
    try {
      console.log("Sending message from ProfileView to:", profile.id, "content:", messageContent);
      
      // Use the content before clearing it
      const contentToSend = messageContent.trim();
      
      // Clear message content early
      setMessageContent("");
      
      await onSendMessage(profile.id, contentToSend);
      
      setIsMessageDialogOpen(false);
      toast.success("Message sent successfully");
    } catch (error: any) {
      toast.error(`Failed to send message: ${error?.message || "Unknown error"}`);
      console.error("Message sending error:", error);
      // Don't restore message content as the dialog will be closed anyway
    } finally {
      setIsSending(false);
    }
  };

  return {
    universityCity,
    isLoadingCity,
    isMessageDialogOpen,
    setIsMessageDialogOpen,
    messageContent,
    setMessageContent,
    isSending,
    handleSendMessage,
    isOwnProfile: currentUserId === profile?.id
  };
};
