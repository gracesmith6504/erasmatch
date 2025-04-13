
import { Input } from "@/components/ui/input";
import { useProfileForm } from "./useProfileForm";
import { ProfileAvatar } from "./components/ProfileAvatar";
import { NameDisplay } from "./components/NameDisplay";
import { UniversityDetails } from "./components/UniversityDetails";
import { AboutMeSection } from "./components/AboutMeSection";
import { PersonalityTagsSection } from "./components/PersonalityTagsSection";

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
    handlePersonalityTagToggle,
  } = useProfileForm();

  return (
    <>
      {/* New centered header section with pastel background */}
      <div className="text-center px-4 pt-6 pb-4 bg-indigo-50 rounded-b-2xl mb-6">
        <ProfileAvatar 
          name={form.name}
          avatarUrl={avatarUrl}
          uploadStatus={uploadStatus}
          handleFileUpload={handleFileUpload}
        />
        
        <NameDisplay 
          name={form.name}
          email={form.email}
          handleChange={handleChange}
        />
      </div>

      <UniversityDetails
        form={form}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        handleUniversityChange={handleUniversityChange}
        handleHomeUniversityChange={handleHomeUniversityChange}
      />

      <AboutMeSection
        bio={form.bio}
        handleChange={handleChange}
      />

      <PersonalityTagsSection
        selectedTags={form.personality_tags || []}
        onToggleTag={handlePersonalityTagToggle}
      />
    </>
  );
}
