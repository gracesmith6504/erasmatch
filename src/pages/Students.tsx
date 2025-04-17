
import React, { useState, useEffect } from "react";
import { Profile } from "@/types";
import { useStudentsData } from "@/hooks/useStudentsData";
import StudentLoadingSkeleton from "@/components/student/StudentLoadingSkeleton";
import StudentFilters from "@/components/student/StudentFilters";
import StudentCardGrid from "@/components/student/StudentCardGrid";
import CitiesView from "@/components/student/CitiesView";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, MapPin } from "lucide-react";

type StudentsProps = {
  profiles: Profile[];
  currentUserId: string | null;
};

const Students = ({ profiles, currentUserId }: StudentsProps) => {
  const {
    universityFilter,
    setUniversityFilter,
    cityFilter,
    setCityFilter,
    personalityTagsFilter,
    setPersonalityTagsFilter,
    uniqueUniversities,
    uniqueCities,
    filteredProfiles,
    loading,
    resetFilters
  } = useStudentsData(profiles, currentUserId);

  const [activeTab, setActiveTab] = useState<"list" | "cities">("list");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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

  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    const hasPhotoA = Boolean(a.avatar_url);
    const hasPhotoB = Boolean(b.avatar_url);

    if (hasPhotoA && !hasPhotoB) return -1;
    if (!hasPhotoA && hasPhotoB) return 1;

    return getCompletionPercentage(b) - getCompletionPercentage(a);
  });

  if (loading) {
    return <StudentLoadingSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8 animate-fade-in overflow-x-hidden w-full">
      <h1 className="text-xl sm:text-2xl font-bold gradient-text mb-4">Find Erasmus Students</h1>

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
            uniqueUniversities={uniqueUniversities}
            uniqueCities={uniqueCities}
            resetFilters={resetFilters}
          />

          <StudentCardGrid 
            filteredProfiles={sortedProfiles} 
            resetFilters={resetFilters} 
          />
        </TabsContent>

        <TabsContent value="cities" className="mt-0 w-full">
          <CitiesView profiles={sortedProfiles} currentUserId={currentUserId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Students;
