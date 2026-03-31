import React, { useState, useEffect } from "react";
import { Profile } from "@/types";
import { useStudentsData } from "@/hooks/useStudentsData";
import { useProfiles } from "@/hooks/useProfiles";
import StudentLoadingSkeleton from "@/components/student/StudentLoadingSkeleton";
import StudentFilters from "@/components/student/StudentFilters";
import StudentCardGrid from "@/components/student/StudentCardGrid";
import CitiesView from "@/components/student/CitiesView";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, MapPin } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { useOnboardingBanner } from "@/hooks/useOnboardingBanner";
import PeopleToMeet from "@/components/student/PeopleToMeet";

type StudentsProps = {
  currentUserId: string | null;
};

const Students = ({ currentUserId }: StudentsProps) => {
  const { data: profiles = [], isLoading: profilesLoading } = useProfiles();

  const {
    universityFilter,
    setUniversityFilter,
    cityFilter,
    setCityFilter,
    personalityTagsFilter,
    setPersonalityTagsFilter,
    semesterFilter,
    setSemesterFilter,
    uniqueUniversities,
    uniqueCities,
    uniqueSemesters,
    filteredProfiles,
    featuredProfiles,
    universityCityMap,
    loading,
    resetFilters
  } = useStudentsData(profiles, currentUserId);

  const [activeTab, setActiveTab] = useState<"list" | "cities">("list");
  const [peopleDismissed] = useState(false);
  const location = useLocation();
  const { showBanner, cityName, hasAvatar } = useOnboardingBanner(currentUserId);

  const fromOnboarding = new URLSearchParams(location.search).get("from") === "onboarding";
  const [showFullRecommendations, setShowFullRecommendations] = useState(fromOnboarding);
  const handleShowAll = () => {
    setShowFullRecommendations(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const currentProfile = profiles.find(p => p.id === currentUserId);
  const showPeopleToMeet = !!currentProfile && !!currentUserId && (
    fromOnboarding || (!!currentProfile.city && !!currentProfile.university)
  );
  
  // Store onboarding completion info when coming from onboarding
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("from") === "onboarding") {
      sessionStorage.setItem("justCompletedOnboarding", "true");
      
      // Find user city from profiles
      const userProfile = profiles.find(p => p.id === currentUserId);
      if (userProfile?.city) {
        sessionStorage.setItem("userCity", userProfile.city);
      }
    }
    
    // Scroll to top when the page loads
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location, profiles, currentUserId]);

  const getCompletionPercentage = (profile: Profile) => {
    const fields = [
      profile.name,
      profile.email,
      profile.university,
      profile.avatar_url,
      profile.bio,
      profile.semester,
      profile.home_university,
      profile.city,
      profile.country,
      profile.interests
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const isFilterActive = Boolean(universityFilter) || Boolean(cityFilter);

  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    const hasPhotoA = Boolean(a.avatar_url);
    const hasPhotoB = Boolean(b.avatar_url);

    if (hasPhotoA && !hasPhotoB) return -1;
    if (!hasPhotoA && hasPhotoB) return 1;

    if (isFilterActive) {
      const activeA = a.last_active_at ? new Date(a.last_active_at).getTime() : 0;
      const activeB = b.last_active_at ? new Date(b.last_active_at).getTime() : 0;
      return activeB - activeA;
    }

    return getCompletionPercentage(b) - getCompletionPercentage(a);
  });

  // Rendering skeleton loaders during loading state
  if (loading || profilesLoading) {
    return <StudentLoadingSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8 animate-fade-in overflow-x-hidden w-full">
      {showBanner && (
        <WelcomeBanner cityName={cityName} hasAvatar={hasAvatar} />
      )}

      {showPeopleToMeet && currentProfile && currentUserId && (
        <PeopleToMeet
          profiles={profiles}
          currentUserId={currentUserId}
          currentProfile={currentProfile}
          fullPage={showFullRecommendations}
          onShowAll={() => setShowFullRecommendations(false)}
        />
      )}
      
      {!showFullRecommendations && (
        <>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-4">Find Erasmus Students</h1>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "list" | "cities")} className="mb-4 w-full overflow-hidden">
            <TabsList className="w-full md:w-auto bg-muted/50 mb-4">
              <TabsTrigger value="list" className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 text-sm sm:text-base flex-1 md:flex-none">
                <Users className="h-4 w-4 mr-1 sm:mr-1.5" />
                <span>All Students</span>
              </TabsTrigger>
              <TabsTrigger value="cities" className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 text-sm sm:text-base flex-1 md:flex-none">
                <MapPin className="h-4 w-4 mr-1 sm:mr-1.5" />
                <span>By City</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="mt-0 w-full">
              <StudentFilters
                universityFilter={universityFilter}
                setUniversityFilter={setUniversityFilter}
                cityFilter={cityFilter}
                setCityFilter={setCityFilter}
                personalityTagsFilter={personalityTagsFilter}
                setPersonalityTagsFilter={setPersonalityTagsFilter}
                semesterFilter={semesterFilter}
                setSemesterFilter={setSemesterFilter}
                uniqueUniversities={uniqueUniversities}
                uniqueCities={uniqueCities}
                uniqueSemesters={uniqueSemesters}
                resetFilters={resetFilters}
              />

              <StudentCardGrid 
                filteredProfiles={sortedProfiles} 
                resetFilters={resetFilters}
                featuredProfiles={featuredProfiles}
                universityCityMap={universityCityMap}
              />
            </TabsContent>
            
            <TabsContent value="cities" className="mt-0 w-full">
              <CitiesView profiles={profiles} currentUserId={currentUserId} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Students;
