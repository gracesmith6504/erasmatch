
import React, { createContext, useContext, useState, useEffect, FormEvent } from "react";
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
  loading: boolean;
  isSaving: boolean;
  fetchingProfile: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | null | string[]) => void;
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

export const ProfileProvider = ({ onProfileUpdate, children }: ProfileProviderProps) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProfileFormState>({
    name: "",
    email: "",
    university: "",
    semester: "",
    bio: "",
    avatar_url: null,
    home_university: "",
    city: null,
    personality_tags: [],
    course: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setFetchingProfile(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData.user) {
          throw new Error("No user found");
        }
        
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.user.id)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }
        
        if (profileData) {
          setForm({
            name: profileData.name || "",
            email: profileData.email || "",
            university: profileData.university || "",
            semester: profileData.semester || "",
            bio: profileData.bio || "",
            avatar_url: profileData.avatar_url,
            home_university: profileData.home_university || "",
            city: profileData.city || null,
            personality_tags: profileData.personality_tags || [],
            course: profileData.course || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setFetchingProfile(false);
      }
    };
    
    fetchUserProfile();
  }, []);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!form.home_university.trim()) {
      toast.error("Please select or enter your home university");
      return;
    }
    
    setIsSaving(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
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
          course: form.course,
        })
        .eq('id', userData.user.id);

      if (error) throw error;
      
      onProfileUpdate(form);
      toast.success("Profile updated successfully");
      navigate("/students");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const value = {
    form,
    loading,
    isSaving,
    fetchingProfile,
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
