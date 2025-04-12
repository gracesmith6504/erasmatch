
import React, { useState } from "react";
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
    tagFilters,
    toggleTagFilter,
    uniqueUniversities,
    uniqueCities,
    filteredProfiles,
    loading,
    resetFilters
  } = useStudentsData(profiles, currentUserId);

  const [activeTab, setActiveTab] = useState<"list" | "cities">("list");

  // Rendering skeleton loaders during loading state
  if (loading) {
    return <StudentLoadingSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-2xl font-bold gradient-text mb-6">Find Erasmus Students</h1>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "list" | "cities")} className="mb-6">
        <TabsList className="w-full md:w-auto bg-muted/50 mb-4">
          <TabsTrigger value="list" className="flex items-center space-x-1.5 px-4 py-2">
            <Users className="h-4 w-4" />
            <span>All Students</span>
          </TabsTrigger>
          <TabsTrigger value="cities" className="flex items-center space-x-1.5 px-4 py-2">
            <MapPin className="h-4 w-4" />
            <span>By City</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-0">
          <StudentFilters
            universityFilter={universityFilter}
            setUniversityFilter={setUniversityFilter}
            cityFilter={cityFilter}
            setCityFilter={setCityFilter}
            uniqueUniversities={uniqueUniversities}
            uniqueCities={uniqueCities}
            tagFilters={tagFilters}
            onTagFilterToggle={toggleTagFilter}
            resetFilters={resetFilters}
          />

          <StudentCardGrid 
            filteredProfiles={filteredProfiles} 
            resetFilters={resetFilters} 
          />
        </TabsContent>
        
        <TabsContent value="cities" className="mt-0">
          <CitiesView profiles={profiles} currentUserId={currentUserId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Students;
