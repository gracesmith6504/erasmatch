
import React, { createContext, useContext, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Profile as ProfileType } from "@/types";
import { supabase } from "@/integrations/supabase/client";

type ProfileFormState = {
  name: string;
  email: string;
  university: string;
  semester: string;
  bio: string;
  avatar_url: string | null;
  home_university: string;
  city: string | null;
  personality_tags: string[];
};

type ProfileContextType = {
  form: ProfileFormState;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | string[] | null) => void;
  handleUniversityChange: (university: string) => void;
  handleHomeUniversityChange: (university: string) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};

type ProfileProviderProps = {
  profile: ProfileType | null;
  onProfileUpdate: (profile: Partial<ProfileType>) => void;
  children: React.ReactNode;
};

export const ProfileProvider = ({ profile, onProfileUpdate, children }: ProfileProviderProps) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    university: profile?.university || "",
    semester: profile?.semester || "",
    bio: profile?.bio || "",
    avatar_url: profile?.avatar_url || null,
    home_university: profile?.home_university || "",
    city: profile?.city || null,
    personality_tags: profile?.personality_tags || [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | string[] | null) => {
    if (name === "personality_tags") {
      // Ensure personality_tags is always an array
      const tagsArray = Array.isArray(value) ? value : (value ? [value] : []);
      setForm((prev) => ({ ...prev, [name]: tagsArray }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUniversityChange = async (university: string) => {
    setForm((prev) => ({ ...prev, university }));
    
    if (!university.trim()) {
      setForm((prev) => ({ ...prev, city: null }));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('universities')
        .select('city')
        .eq('name', university)
        .single();
      
      if (error) {
        console.error('Error fetching university city:', error);
        return;
      }
      
      setForm((prev) => ({ ...prev, university, city: data?.city || null }));
    } catch (error) {
      console.error('Error in university change handler:', error);
    }
  };
  
  const handleHomeUniversityChange = (home_university: string) => {
    setForm((prev) => ({ ...prev, home_university }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!form.university.trim()) {
      toast.error("Please select or enter a university");
      return;
    }
    
    setLoading(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error("No user found");
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: form.name,
          university: form.university,
          semester: form.semester,
          bio: form.bio,
          avatar_url: form.avatar_url,
          home_university: form.home_university,
          city: form.city,
          personality_tags: form.personality_tags,
        })
        .eq('id', user.user.id);

      if (error) throw error;
      
      onProfileUpdate(form);
      toast.success("Profile updated successfully");
      navigate("/students");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    form,
    loading,
    handleChange,
    handleSelectChange,
    handleUniversityChange,
    handleHomeUniversityChange,
    handleSubmit
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
