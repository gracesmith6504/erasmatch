
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
  course: string;
};

type ProfileContextType = {
  form: ProfileFormState;
  profile: ProfileType | null;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | null | string[]) => void;
  handleUniversityChange: (university: string) => void;
  handleHomeUniversityChange: (university: string) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  updateProfile: (newData: Partial<ProfileType>) => Promise<void>;
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
  onProfileUpdate: (profile: Partial<ProfileType>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  children: React.ReactNode;
};

export const ProfileProvider = ({ profile: initialProfile, onProfileUpdate, fetchProfile, children }: ProfileProviderProps) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileType | null>(initialProfile);
  const [form, setForm] = useState({
    name: initialProfile?.name || "",
    email: initialProfile?.email || "",
    university: initialProfile?.university || "",
    semester: initialProfile?.semester || "",
    bio: initialProfile?.bio || "",
    avatar_url: initialProfile?.avatar_url || null,
    home_university: initialProfile?.home_university || "",
    city: initialProfile?.city || null,
    personality_tags: initialProfile?.personality_tags || [],
    course: initialProfile?.course || "",
  });
  const [loading, setLoading] = useState(false);

  // Update form state when profile changes
  React.useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
      setForm({
        name: initialProfile.name || "",
        email: initialProfile.email || "",
        university: initialProfile.university || "",
        semester: initialProfile.semester || "",
        bio: initialProfile.bio || "",
        avatar_url: initialProfile.avatar_url || null,
        home_university: initialProfile.home_university || "",
        city: initialProfile.city || null,
        personality_tags: initialProfile.personality_tags || [],
        course: initialProfile.course || "",
      });
    }
  }, [initialProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | null | string[]) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUniversityChange = async (university: string) => {
    setForm((prev) => ({ ...prev, university }));
    
    // If university is empty, clear the city field
    if (!university.trim()) {
      setForm((prev) => ({ ...prev, city: null }));
      return;
    }

    // Fetch corresponding city from universities table
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('city')
        .eq('name', university)
        .single();
      
      if (error) {
        console.error('Error fetching university city:', error);
        // Don't update city if there's an error
        return;
      }
      
      // Update city in form state
      setForm((prev) => ({ ...prev, university, city: data?.city || null }));
      
    } catch (error) {
      console.error('Error in university change handler:', error);
    }
  };
  
  const handleHomeUniversityChange = (home_university: string) => {
    setForm((prev) => ({ ...prev, home_university }));
  };

  // New updateProfile function that updates local state immediately
  const updateProfile = async (newData: Partial<ProfileType>) => {
    try {
      // Update backend
      await onProfileUpdate(newData);
      
      // Update local state immediately without waiting for backend sync
      setProfile((prev) => prev ? { ...prev, ...newData } : null);
      
      // Update form state if needed
      setForm(prev => ({
        ...prev,
        ...Object.entries(newData).reduce((acc, [key, value]) => {
          if (key in prev) {
            acc[key as keyof typeof prev] = value as any;
          }
          return acc;
        }, {} as typeof prev)
      }));
      
    } catch (error: any) {
      console.error("Profile update error:", error);
      throw error; // Re-throw to let caller handle
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!form.home_university.trim()) {
      toast.error("Please select or enter your home university");
      return;
    }
    
    setLoading(true);

    try {
      // Use the new updateProfile function
      await updateProfile({
        name: form.name,
        university: form.university,
        semester: form.semester,
        bio: form.bio,
        avatar_url: form.avatar_url,
        home_university: form.home_university,
        city: form.city,
        personality_tags: form.personality_tags,
        course: form.course,
      });
      
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
    profile,
    loading,
    handleChange,
    handleSelectChange,
    handleUniversityChange,
    handleHomeUniversityChange,
    handleSubmit,
    updateProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
