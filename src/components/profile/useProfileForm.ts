
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Profile as ProfileType } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const useProfileForm = (
  profile: ProfileType | null, 
  onProfileUpdate: (profile: Partial<ProfileType>) => void
) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    university: profile?.university || "",
    city: profile?.city || "",
    semester: profile?.semester || "",
    bio: profile?.bio || "",
    avatar_url: profile?.avatar_url || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUniversityChange = (university: string) => {
    setForm((prev) => ({ ...prev, university }));
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
          city: form.city,
          semester: form.semester,
          bio: form.bio,
          avatar_url: form.avatar_url,
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

  return {
    form,
    loading,
    handleChange,
    handleSelectChange,
    handleUniversityChange,
    handleSubmit
  };
};
