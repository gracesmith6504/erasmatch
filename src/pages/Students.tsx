
import React from "react";
import { Profile } from "@/types";
import { useStudentsData } from "@/hooks/useStudentsData";
import StudentLoadingSkeleton from "@/components/student/StudentLoadingSkeleton";
import StudentFilters from "@/components/student/StudentFilters";
import StudentCardGrid from "@/components/student/StudentCardGrid";

type StudentsProps = {
  profiles: Profile[];
  currentUserId: string | null;
};

const Students = ({ profiles, currentUserId }: StudentsProps) => {
  const {
    searchTerm,
    setSearchTerm,
    universityFilter,
    setUniversityFilter,
    cityFilter,
    setCityFilter,
    semesterFilter,
    setSemesterFilter,
    uniqueUniversities,
    uniqueCities,
    uniqueSemesters,
    filteredProfiles,
    loading,
    resetFilters
  } = useStudentsData(profiles, currentUserId);

  // Rendering skeleton loaders during loading state
  if (loading) {
    return <StudentLoadingSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-2xl font-bold gradient-text mb-6">Find Erasmus Students</h1>

      <StudentFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        universityFilter={universityFilter}
        setUniversityFilter={setUniversityFilter}
        cityFilter={cityFilter}
        setCityFilter={setCityFilter}
        semesterFilter={semesterFilter}
        setSemesterFilter={setSemesterFilter}
        uniqueUniversities={uniqueUniversities}
        uniqueCities={uniqueCities}
        uniqueSemesters={uniqueSemesters}
        resetFilters={resetFilters}
      />

      <StudentCardGrid 
        filteredProfiles={filteredProfiles} 
        resetFilters={resetFilters} 
      />
    </div>
  );
};

export default Students;
