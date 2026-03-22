/**
 * Global data provider for profiles and messages.
 * Fetches data from Supabase when the user is authenticated and provides
 * helper functions for sending messages and updating profiles.
 */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, Message } from "@/types";
import { createNotification } from "@/utils/notifications";
import { useAuth } from "./AuthContext";

type DataContextType = {
  profiles: Profile[];
  messages: Message[];
  handleSendMessage: (receiverId: string, content: string) => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  fetchProfile: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

type DataProviderProps = {
  children: ReactNode;
};

export const DataProvider = ({ children }: DataProviderProps) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const { currentUserId, isAuthenticated } = useAuth();

  // Fetch data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      fetchProfiles();
      fetchUserMessages(currentUserId);
    }
  }, [isAuthenticated, currentUserId]);

  /** Fetches all user profiles (for student discovery and messaging). */
  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, university, city, deleted_at, personality_tags, bio, home_university, semester, course, looking_for, ref_code, arrival_date, last_active_at');
      
      if (error) throw error;
      
      if (data) {
        const processedProfiles = data.map(profile => ({
          ...profile,
          country: null,
          interests: null,
          personality_tags: profile.personality_tags || []
        })) as Profile[];
        
        setProfiles(processedProfiles);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  /** Fetches direct messages where the current user is sender or receiver. */
  const fetchUserMessages = async (userId: string) => {
    try {
      const { data: userMessages, error } = await supabase
        .from('messages')
        .select('id, sender_id, receiver_id, content, created_at, read_by')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (userMessages) setMessages(userMessages as Message[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  /**
   * Sends a direct message and triggers an email notification
   * to the receiver via the send-message-notification Edge Function.
   */
  const handleSendMessage = async (receiverId: string, content: string): Promise<void> => {
    if (!currentUserId) return;

    try {
      // Check bidirectional block before sending
      const { data: blocked } = await supabase.rpc("is_blocked", {
        user_a: currentUserId,
        user_b: receiverId,
      });
      if (blocked) {
        throw new Error("Unable to send message to this user.");
      }

      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          receiver_id: receiverId,
          content
        })
        .select('id, sender_id, receiver_id, content, created_at')
        .single();

      if (messageError) throw messageError;

      // Fetch sender profile for notification text
      const { data: senderProfile, error: senderError } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', currentUserId)
        .single();

      if (senderError) throw senderError;

      // Send email notification (email lookup happens server-side)
      const response = await supabase.functions.invoke('send-message-notification', {
        body: {
          senderName: senderProfile?.name || 'Someone',
          senderAvatarUrl: senderProfile?.avatar_url || null,
          messageContent: content,
          receiverId: receiverId
        }
      });

      if (response.error) {
        console.error('Error sending email notification:', response.error);
      }

      // Create in-app notification for the receiver
      const senderName = senderProfile?.name || 'Someone';
      createNotification({
        userId: receiverId,
        type: 'direct_message',
        actorId: currentUserId,
        referenceId: messageData?.id,
        title: 'New message',
        body: `${senderName} sent you a message`,
      });

      // Optimistically update local state
      if (messageData) {
        setMessages(prev => [messageData as Message, ...prev]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  /** Updates the current user's profile in the database and local state. */
  const updateProfile = async (updatedProfile: Partial<Profile>): Promise<void> => {
    if (!currentUserId) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', currentUserId);
      
      if (error) throw error;
      
      setProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.id === currentUserId 
            ? { ...profile, ...updatedProfile } 
            : profile
        )
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  /** Re-fetches the current user's profile from the database. */
  const fetchProfile = async (): Promise<void> => {
    if (!currentUserId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, university, city, deleted_at, personality_tags, bio, home_university, semester, course, looking_for, ref_code, arrival_date, onboarding_complete, email_notifications, last_active_at')
        .eq('id', currentUserId)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfiles(prevProfiles => {
          const profileExists = prevProfiles.some(p => p.id === currentUserId);
          if (profileExists) {
            return prevProfiles.map(p => p.id === currentUserId ? { 
              ...p, ...data, country: null, interests: null 
            } as Profile : p);
          } else {
            return [...prevProfiles, { 
              ...data, country: null, interests: null,
              personality_tags: data.personality_tags || []
            } as Profile];
          }
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <DataContext.Provider
      value={{ profiles, messages, handleSendMessage, updateProfile, fetchProfile }}
    >
      {children}
    </DataContext.Provider>
  );
};
