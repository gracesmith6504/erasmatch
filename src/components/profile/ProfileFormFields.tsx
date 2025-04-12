
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UniversityAutocomplete from "@/components/UniversityAutocomplete";
import { useProfileForm } from "./useProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";

const SEMESTERS = ["Fall 2024", "Spring 2025", "Fall 2025", "Spring 2026"];

const PERSONALITY_TAGS = [
  { value: "Weekend Trips", label: "🗺️ Weekend Trips" },
  { value: "Beach Days", label: "🏖️ Beach Days" },
  { value: "Train Adventures", label: "🚆 Train Adventures" },
  { value: "Pub Nights", label: "🍻 Pub Nights" },
  { value: "Clubbing", label: "🕺 Clubbing" },
  { value: "Sport", label: "🏅 Sport" },
  { value: "Music Lover", label: "🎧 Music Lover" },
  { value: "Photography", label: "📸 Photography" },
  { value: "Artsy", label: "🎨 Artsy" },
  { value: "Mindfulness", label: "🧘 Mindfulness" },
  { value: "Bookworm", label: "📚 Bookworm" },
  { value: "Café Hunting", label: "☕ Café Hunting" },
  { value: "Social Butterfly", label: "🧑‍🤝‍🧑 Social Butterfly" },
  { value: "Open-minded", label: "🌟 Open-minded" },
  { value: "Looking to meet new people", label: "👀 Looking to meet new people" }
];

export function ProfileFormFields() {
  const { 
    form, 
    handleChange, 
    handleSelectChange,
    handleUniversityChange,
    handleHomeUniversityChange,
    handleFileUpload, 
    uploadStatus, 
    avatarUrl, 
    handleRemoveAvatar 
  } = useProfileForm();

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
          <Label htmlFor="home_university" className="block text-sm font-medium text-gray-700">
            Home University
          </Label>
          <UniversityAutocomplete
            value={form.home_university}
            onChange={handleHomeUniversityChange}
          />
        </div>

        <div className="space-y-2">
          <UniversityAutocomplete
            value={form.university}
            onChange={handleUniversityChange}
            label="Destination University"
          />
          
          {form.university && (
            <div className="flex items-center text-sm mt-2 text-gray-600">
              <MapPin className="h-4 w-4 mr-1 text-erasmatch-green" />
              <span>
                {form.city ? form.city : "City not available for this university"}
              </span>
            </div>
          )}
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
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="bg-gray-100">
                {form.name ? form.name.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              {!uploadStatus.uploading ? (
                <>
                  <label htmlFor="avatar-upload">
                    <Button type="button" variant="outline" size="sm" className="cursor-pointer" asChild>
                      <div className="flex items-center gap-2">
                        <Upload size={16} />
                        {avatarUrl ? "Change Photo" : "Upload Photo"}
                      </div>
                    </Button>
                  </label>
                  <Input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveAvatar}
                      className="text-red-500 hover:text-red-600 flex items-center gap-2"
                    >
                      <X size={16} />
                      Remove
                    </Button>
                  )}
                </>
              ) : (
                <Button disabled size="sm" variant="outline">
                  Uploading...
                </Button>
              )}
              {uploadStatus.error && (
                <p className="text-xs text-red-500 mt-1">{uploadStatus.error}</p>
              )}
            </div>
          </div>
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

      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          What describes you?
        </Label>
        <MultiSelect
          options={PERSONALITY_TAGS}
          value={form.personality_tags || []}
          onValueChange={(values) => handleSelectChange("personality_tags", values)}
          placeholder="Select personality tags"
        />
      </div>
    </>
  );
}
