
import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Profile } from "@/types";
import StudentCard from "./StudentCard";

interface StudentCardGridProps {
  filteredProfiles: Profile[];
  resetFilters: () => void;
}

const StudentCardGrid = ({ filteredProfiles, resetFilters }: StudentCardGridProps) => {
  return (
    <>
      {/* Results count */}
      <div className="mb-6 text-sm text-gray-600">
        Showing <span className="font-medium text-gray-900">{filteredProfiles.length}</span> students
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No students found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
          <Button className="button-hover" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <StudentCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </>
  );
};

export default StudentCardGrid;
