
import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Profile as ProfileType } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const SEMESTERS = ["Fall 2024", "Spring 2025", "Fall 2025", "Spring 2026"];

type ProfileProps = {
  profile: ProfileType | null;
  onProfileUpdate: (profile: Partial<ProfileType>) => void;
};

const Profile = ({ profile, onProfileUpdate }: ProfileProps) => {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error("No user found");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          name: form.name,
          university: form.university,
          city: form.city,
          semester: form.semester,
          bio: form.bio,
          avatar_url: form.avatar_url,
        })
        .eq("id", user.user.id);

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

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {profile?.name ? "Edit Your Profile" : "Complete Your Profile"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email || ""}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled
                className="mt-1 bg-gray-50"
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div>
              <Label htmlFor="university" className="block text-sm font-medium text-gray-700">
                University
              </Label>
              <Input
                id="university"
                name="university"
                value={form.university || ""}
                onChange={handleChange}
                placeholder="Your host university"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </Label>
              <Input
                id="city"
                name="city"
                value={form.city || ""}
                onChange={handleChange}
                placeholder="Your exchange city"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                Exchange Semester
              </Label>
              <Select
                value={form.semester || ""}
                onValueChange={(value) => handleSelectChange("semester", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a semester" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">
                Profile Picture URL
              </Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                value={form.avatar_url || ""}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              About Me
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={form.bio || ""}
              onChange={handleChange}
              placeholder="Tell others about yourself, your interests, and what you're looking forward to in your Erasmus experience"
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
