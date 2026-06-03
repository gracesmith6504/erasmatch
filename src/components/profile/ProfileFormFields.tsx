
import { useProfileForm } from "./useProfileForm";
import { ProfileAvatar } from "./components/ProfileAvatar";
import { NameDisplay } from "./components/NameDisplay";
import { UniversityDetails } from "./components/UniversityDetails";
import { AboutMeSection } from "./components/AboutMeSection";
import { PersonalityTagsSection } from "./components/PersonalityTagsSection";
import { LookingForSection } from "./components/LookingForSection";

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
    handleLookingForToggle,
  } = useProfileForm();

  return (
    <div className="space-y-8">
      {/* Avatar & Name header */}
      <div className="text-center px-4 pt-8 pb-6 bg-secondary/50 rounded-2xl">
        <ProfileAvatar 
          name={form.name}
          avatarUrl={avatarUrl}
          uploadStatus={uploadStatus}
          handleFileUpload={handleFileUpload}
        />
        
        <div className="mt-4">
          <NameDisplay 
            name={form.name}
            email={form.email}
            handleChange={handleChange}
          />
        </div>
      </div>

      {/* University & Academic Details */}
      <section className="space-y-2">
        <h3 className="text-base font-display font-semibold text-foreground">🎓 Academic Details</h3>
        <p className="text-sm text-muted-foreground mb-4">Where you're studying and where you're headed.</p>
        <UniversityDetails
          form={form}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleUniversityChange={handleUniversityChange}
          handleHomeUniversityChange={handleHomeUniversityChange}
        />
      </section>

      {/* About Me */}
      <section className="space-y-2">
        <h3 className="text-base font-display font-semibold text-foreground">✍️ About You</h3>
        <p className="text-sm text-muted-foreground mb-4">Let other students get to know you.</p>
        <AboutMeSection
          bio={form.bio}
          handleChange={handleChange}
        />
      </section>

      {/* Looking For */}
      <section>
        <LookingForSection
          selectedOptions={form.looking_for || []}
          onToggleOption={handleLookingForToggle}
        />
      </section>

      {/* Personality Tags */}
      <section>
        <PersonalityTagsSection
          selectedTags={form.personality_tags || []}
          onToggleTag={handlePersonalityTagToggle}
        />
      </section>
    </div>
  );
}
