
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UniversityAutocomplete from "@/components/UniversityAutocomplete";
import { useProfileForm } from "./useProfileForm";

const SEMESTERS = ["Fall 2024", "Spring 2025", "Fall 2025", "Spring 2026"];

export function ProfileFormFields() {
  const { form, handleChange, handleSelectChange, handleUniversityChange } = useProfileForm();

  return (
    <>
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
          <UniversityAutocomplete
            value={form.university}
            onChange={handleUniversityChange}
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
    </>
  );
}
